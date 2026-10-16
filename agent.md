# agent.md — Cosmosis web app: architecture, conventions and change log

This file is the hand-off for any AI coding agent (Codex, Copilot, etc.) working on this repo.
Read sections 1–9 before changing anything. Section 10 lists what was changed recently, section 11
lists known problems. Everything here was verified against the code unless marked *(not reviewed)*.

Last updated: 2026-10-16. Repo: `aitizaz-ul-haq/cosmosiswebapp`, branch `main`.

---

## 1. What the product is

**Cosmosis** is a multi-tenant digital **client onboarding** platform for wealth-management firms
(the main tenant is "Nemesis"). Relationship Managers (RMs) create clients, a supervisor approves
them, the RM registers them (credentials are emailed immediately or at a scheduled time), and the
client then completes a 6-phase onboarding form. A public marketing site, a login page and a
role-based dashboard live in the same Next.js app.

Roles (`User.role`): `superadmin`, `supervisor`, `rm`, `client`. Every non-superadmin user belongs to
one `Company` (tenant). Data is scoped by `companyId`.

## 2. Stack and how to run

- Next.js **14.2.31 App Router**, React 18, **plain JavaScript** (no TypeScript), `@/*` → `src/*`.
- MongoDB via **Mongoose 8**. Auth: **JWT in an HttpOnly cookie** (`jsonwebtoken` in API routes, `jose` in middleware), `bcrypt` for passwords.
- Email: **nodemailer** (Gmail SMTP). Tables: `@tanstack/react-table`.
- Styling: plain CSS files imported by components + inline styles. **No Tailwind, no CSS modules** (the default `page.module.css` is unused). Font: **Poppins** via `next/font` → CSS var `--font-poppins`.
- No test suite. Verification is lint + production build + browser checks (see §12).
- Scripts: `npm run dev | build | start | lint`. Package manager in `package.json` is yarn, but `package-lock.json` is present too.

### Environment variables (names only — never commit values)

| Name | Used for |
|---|---|
| `MONGODB_URI` | `src/lib/mongodb.js` (throws on import if missing) |
| `JWT_SECRET` | signing/verifying the login cookie (`api/login`, `lib/auth.js`, `middleware.js`) |
| `CREDENTIALS_SECRET` | AES key for stored scheduled passwords (falls back to `JWT_SECRET`). **Do not change after data exists** — stored passwords become undecryptable |
| `SMTP_USER`, `SMTP_PASS` | Gmail sender for credentials/registration emails (`SMTP_PASS` must be a Google App Password) |
| `APP_URL` | public base URL for email links (login link, logo); falls back to the request origin |
| `CRON_SECRET` | Bearer token required by `/api/cron/dispatch-scheduled` |
| `EMAIL_USER`, `EMAIL_PASS` | contact-form mailer (`api/contact`) |
| `SUPERADMIN_EMAIL` | recipient of demo-request emails (`api/requestdemo`) |

`.env.local` is git-ignored. **`db_credentials.txt` and `cookies.txt` at the repo root ARE tracked by git** — see §11.

## 3. Repository map

```
src/
  middleware.js                 Auth + role gate for /dashboard/* and /api/*
  app/
    layout.js                   Root layout: Poppins font, <UserProvider>
    globals.css                 Design tokens (:root), global .dash-action-btn / .dash-btn-* classes
    page.js                     Public marketing home page
    login/                      Login page (see §9)
    dashboard/
      page.js                   Role-aware dashboard shell: picks the page by ?menu= / activeMenu
      config.js                 dashboardConfigs: sidebar menu per role
      components/ActionLogger.js  Global click logger (see §7)
      components/dashboardshell/
        dashboardshell.js       Sidebar + header + content frame
        subcomps/               Header, sidebar, menu section pieces
        styles/                 Shell/dashboards CSS
        pages/                  ONE FILE PER SIDEBAR PAGE + shared UI (see §6)
    api/                        Route handlers (see §5)
    context/UserContext.js      { user, login, logout, loading }; auto-login via GET /api/me
    components/                 Public site: layoutcomponens (header/footer), pagecomponents (home sections)
    data/                       JSON copy: homepagedata/homaepagedata.json (sic), loginpagedata/loginpagedata.json
  lib/                          Server + client helpers (see §7)
  models/                       Mongoose models (see §4)
  utils/generatePassword.js     Random password generator
scripts/                        backfillLogs.js, inspectNemesis*.js, seedNemesisClients.js  (utility scripts, *not reviewed*)
public/images/                  All images. login-bg.webp = login background. example_modal_1..5.png = design references
```

Class-name prefixes (keep using them): `dash-` global buttons, `generic-table-` tables, `onbs-` onboarding
*status* page, `onb-` client onboarding *form*, `sub-` submissions, `mk-` modal kit, `login-`/`loginform-` login.

## 4. Data models (`src/models`)

- **User** — `username` (unique, lowercase), `passwordHash`, `role`, `companyId`/`companyName`
  (required unless superadmin; a `pre("validate")` hook enforces it), `fullName`, `email`, `phone`,
  `isActive` (default true), `createdBy`. Timestamps.
- **Company** — `name`, `legalName`, `tenantKey` (unique slug), `status` (active/suspended), contact,
  address, registration/tax/website, branding (`logoUrl`…).
- **ClientProfile** — one per client user (`userId` unique). Key fields:
  - Tenancy/ownership: `companyId`, `companyName`, `createdByUserId`, `assignedToUserId` (the RM), `isShared`, `sharedWithUserIds`, `createdByNameSnapshot`.
  - `status` (workflow, see §8): `approval_pending → under_review → register → scheduled → ongoing | on_hold | cancelled` (default `ongoing`).
  - Scheduling: `scheduledRegistrationAt` (Date, UTC), `scheduledCountry`, `scheduledCity`, `scheduledTimeZone` (IANA), `scheduledCredentialsEnc` (**`select:false`**, AES-GCM), `registeredAt`, `approvedAt`, `approvedByUserId`.
  - `onboardingType`: `individual | joint | corporate | trust`. Only **individual** has a form.
  - `onboarding`: `{ status (not_started|in_progress|submitted|approved|rejected), currentStep (1–6), completedSteps[], progress 0–100, submittedAt, approvedAt, rejectedAt, rejectionReason }`.
  - Large sub-documents for the form data (`accountHolders`, `investmentServices`, `externalAdvisers`, `sourceOfWealth`, `financialProfile`, `riskProfile`, signature, documents…). **The client form does not write to these yet** (§11).
  - `rmRemarks`.
- **Log** — audit trail: `userId`, `role`, denormalised `name/username/companyId/companyName`, `action`, `actionTitle`, `metadata`, `ip`, `userAgent`. Indexed by time/company/user.
- **DemoRequest** — requests from the public "request a demo" form *(not reviewed in detail)*.

All models use `mongoose.models.X || mongoose.model(...)`. DB connection is cached on `global.mongoose` (`lib/mongodb.js`).

## 5. Authentication, authorisation and the API

### Auth flow
1. `POST /api/login` → bcrypt compare → signs a JWT `{id, username, role, companyId}` (1 day) → sets HttpOnly cookie `token` (`secure` in production, `sameSite: lax`).
   Clients with `isActive === false` get **403** ("account not active yet") — this is how scheduled clients are blocked until their email is sent.
2. `UserContext` calls `GET /api/me` on every page load to restore the session; `login()` calls `/api/login` then `/api/me`.
3. `POST /api/logout` clears the cookie.
4. API handlers call `verifyToken(req)` (`lib/auth.js`; reads cookie, falls back to `Authorization: Bearer`).

### `middleware.js` (first line of defence)
- `PUBLIC_PATHS` (prefix match): `/login`, `/api/login`, `/api/register`, `/api/requestdemo`, `/api/cron`.
- Everything else under `/dashboard/*` and `/api/*` needs a valid `token`; missing/invalid → redirect to `/login`.
- `ROLE_RULES` = allowed **path prefixes per role** (non-matching → JSON 403):
  - superadmin: `/dashboard, /api/companies, /api/users, /api/clients, /api/log, /api/logs, /api/demo-requests, /api/demo-users, /api/me, /api/logout, /api/verify-password`
  - supervisor: `/dashboard, /api/users, /api/companies, /api/clients, /api/me, /api/logout, /api/verify-password, /api/log`
  - rm: `/dashboard, /api/users, /api/clients, /api/me, /api/logout, /api/verify-password, /api/log`
  - client: `/dashboard, /api/me, /api/clients/me, /api/logout, /api/log`
- **When you add an API route, add its prefix to `ROLE_RULES` or it will 403.** Handlers must still do their own fine-grained role/tenant checks.

### API surface (`src/app/api/**/route.js`)

| Route | Methods | Notes |
|---|---|---|
| `login`, `logout`, `me` (GET/PATCH profile), `me/change-password`, `verify-password` | | `verify-password` checks the logged-in user's password (used by delete confirmations and the Submissions gate) |
| `register` | POST | **Public + takes `role` from the body — see §11 (critical)** |
| `users` | POST GET PATCH DELETE | Manage supervisors/RMs/users within tenant rules (superadmin→supervisors, supervisor→RMs…) |
| `companies`, `companies/[id]/users` | POST GET PATCH DELETE / GET DELETE | superadmin only |
| `clients` | GET POST PATCH DELETE | Core client list + lifecycle. PATCH `action: "approve"` → `register`; `action: "review"` → `under_review`; `{status}` for ongoing/on_hold/cancelled; RMs may only change status of their own engaged clients. GET also runs `dispatchScheduledOnboardings()` as a backup trigger |
| `clients/registry` | POST PATCH | RM only. POST registers a client now, or `action:"schedule"` (stores encrypted password + schedule, `isActive=false`); PATCH edits basic details before registration |
| `clients/scheduled` | GET PATCH | RM only. GET decrypts credentials for the details modal; PATCH re-schedules |
| `clients/me` | GET | **client only**: own profile + onboarding |
| `cron/dispatch-scheduled` | GET | Needs `Authorization: Bearer <CRON_SECRET>`; sends all due scheduled onboardings |
| `log`, `log/batch`, `logs` | POST / POST / GET | Write audit entries; `logs` GET is superadmin only |
| `demo-requests`, `demo-users`, `requestdemo`, `contact` | | Public-site/demo machinery *(not reviewed in detail)*. `demo-users` returns password hashes (superadmin only via middleware). `contact` is not in `PUBLIC_PATHS`, so anonymous calls are redirected — nothing in the UI calls it |

## 6. Dashboard architecture (`src/app/dashboard`)

- **`page.js`** is a client component wrapped in `<Suspense>` (needed for `useSearchParams`). It
  reads `user.role`, takes `config.sidebar.menu[0]` as the default menu (or `?menu=<key>`), and renders
  `getPageMap(role, setActiveMenu)[activeMenu]` inside `<DashboardShell>`. Add a page = create the
  component, add it to `getPageMap`, add a menu entry in `config.js`.
- **`config.js`** sidebar per role:
  - superadmin: dashboard, companies, supervisors, users, logs, reports, profile
  - supervisor: dashboard, rms, clients, onboardingstatus, approvals, underreview, reports, submissions, profile
  - rm: dashboard, clients, registry, scheduled, onboardingstatus, notifications, submissions, profile
  - client: **dashboard, onboarding, submissions, profile**
- **Pages** (`dashboardshell/pages/`): `ClientsPage` (create/edit/info/delete clients), `ApprovalsPage` (approve/review/verify), `UnderReviewPage`, `RegistryPage` (awaiting registry: register now / schedule / edit), `ScheduledPage` + `ScheduledDetailsModal`, `OnboardingStatusPage` (expandable rows + timeline), `SubmissionsPage` (accordion, password gate), `ClientSubmissionsPage`, `ClientDashboard`, `OnboardingPage` (client phase timeline), `RMsPage`, `SupervisorPage`, `UserPage`, `CompaniesPage`, `LogsPage`, `ProfilePage`, `ReportsPage`, role home dashboards (`RMDashboard`, `SupervisorDashboard`, `SuperAdminDashboard`), `GenericTable` + `pagecomponents/` (header, filter, thead/tbody, modal).
- **Shared logic**: `clientStatusShared.js` — `STATUS_LABELS`, `STATUS_COLORS`, `PHASE_CONFIG` (6 phases → 20/35/50/65/80/100 %), `PHASE_SECTIONS`, `getPhaseConfig`, `actionBtnStyle`, `ClientStatusBadge`, legacy modal style objects. `modalkit/` — see §9a.
- **Data fetching pattern**: each page `fetch("/api/...", { credentials: "include" })` in `useEffect`; no global store besides `UserContext`. Pagination/filtering is client-side (`PAGE_SIZE` 8 on list pages).
- **`ActionLogger`** is mounted once and logs every click (see §7). Put `data-log-title="…"` on buttons you add so the audit log is readable (keep the existing ones when restyling).

## 7. Cross-cutting libraries (`src/lib`)

- `mongodb.js` cached connection · `auth.js` `verifyToken` · `credentialCrypto.js` AES-256-GCM `encryptSecret/decryptSecret` (key = sha256(`CREDENTIALS_SECRET`||`JWT_SECRET`)).
- `parseSchedule.js` validates `{country, city, timeZone (IANA via Intl), scheduledAt (future)}`.
- `dispatchScheduledOnboardings.js` — the dispatcher (see §8). `sendCredentialsEmail.js` + `emails/clientRegistrationEmail.js` — HTML/text credentials email with inline logo (`public/images/cosmosis_logo_dark_dashboard.png`).
- Logging: client `logUIAction` (`lib/logUIAction.js` → `/api/log`, immediate) and the batching `lib/logger.js` (→ `/api/log/batch`, flush at 10 entries / 5 s / unload). Server `enrichLog.js` resolves name/company for a log row (falls back to `metadata.username` for failed logins). `ActionLogger` uses the batching logger.

## 8. Core workflows

### Client lifecycle (`ClientProfile.status`)
`approval_pending` (created by RM/supervisor) → **supervisor** `review` → `under_review` → **supervisor** `approve` → `register` ("Awaiting registry", RM) →
RM registers: **now** → `ongoing` + `isActive=true` + credentials email; **scheduled** → `scheduled` + `isActive=false` + encrypted password stored →
dispatcher activates → `ongoing`. From `ongoing` the RM can set `on_hold` / `cancelled` (and back). RMs cannot touch `approval_pending/under_review/register/scheduled`.
"Verify" in Approvals just opens `https://www.nemesisam.com/` in a new tab.

### Scheduled onboarding (credentials emailed at a chosen local time)
1. RM picks country + city (European list in `scheduling/europeLocations.js`, each city → IANA zone), date, time. `timeUtils.zonedTimeToUtc` converts to a UTC instant (rejects non-existent DST times). The UI shows AM/PM + the RM's own time before confirming.
2. `POST /api/clients/registry {action:"schedule"}` stores `scheduledRegistrationAt` (UTC), place, zone and the AES-encrypted password; client stays `isActive=false`.
3. **Nothing in the Next.js process wakes up by itself.** Delivery is triggered by (a) an **external cron** calling `GET /api/cron/dispatch-scheduled` with the bearer secret every minute, and (b) as a backup, every `GET /api/clients` (any supervisor/RM/superadmin loading the list).
4. `dispatchScheduledOnboardings` atomically claims due profiles (`findOneAndUpdate` scheduled→ongoing), decrypts the password, emails the client, sets `isActive=true`, wipes the stored secret/schedule. On failure it flips the profile back to `scheduled` for retry.
5. Deployment plan: **Vercel Hobby** (cron limited to daily) ⇒ use **cron-job.org** (free, every minute, header `Authorization: Bearer <CRON_SECRET>`). The app has **not been deployed yet**; set the env vars in §2 first. Local test: loop `curl` against `localhost:3000/api/cron/dispatch-scheduled`.

### Client onboarding form (individual only)
Client sidebar → **Onboarding** (`OnboardingPage`): a timeline of Phase 0–6. Clicking a phase opens a modal.
- **Phase 0** (Prerequisites, `PrerequisitesModal` + `onboarding/legal/*`): read-only legal documents. **Do not restyle without being asked.**
- **Phases 1–6** (`PhaseModal` + `phases/Phase1..6*.js`): Personal Details, Source of Wealth, Financial Profile, Risk Profile, Signature, Documentation Checklist. Built from primitives in `onboarding/fields.js` (`Field`, `TextArea`, `SelectField`, `CountrySelect`, `ChoiceGroup`, `CheckRow`, `YesNo`, `SectionTitle`, `Note`). Inputs are **uncontrolled** (`name` attributes only) — nothing is saved or sent to the API yet.
- `OnboardingPage` loads `/api/clients/me` (type, onboarding, profile) and uses `onboarding.currentStep` for the highlighted node. Non-individual types show a "coming soon" message.

### Submissions (UI-only for now)
`SubmissionsPage` (RM + supervisor): password gate (`PasswordGate` → `/api/verify-password`, asked on every open; **client-side gate only**) → paginated accordion of engaged clients (ongoing/on_hold/cancelled) → per-phase rows (`PhaseRow`) → `SubmissionViewModal`.
`ClientSubmissionsPage` (client): only the client's own phase rows (no accordion/filters/gate) with **Notify RM** and **Edit** placeholder buttons in the modal (no behaviour yet).
**All submission data is generated by `submissions/dummySubmissions.js`** (phases below the client's `currentStep` = completed; the current phase = partial). Replace with real data once the form persists.

## 9. UI system and conventions (follow these for any new UI)

### Design tokens
- Font: Poppins (`var(--font-poppins)`). Root tokens in `globals.css`: `--sitegreen #21CFB2`, `--sitedark #6D7692` (slate), `--sitewhite`.
- Palette used everywhere (hex, keep consistent): ink `#1a1a1a`; slate `#6d7692`; **soft green** fill `#e3f8f2` / text+icon `#17b89b` / hover `#d3f3ea`; slate-soft `#eceff7` (hover `#e1e5f0`); blue `#e6effd`/`#3a6fd8`; violet `#efeafd`/`#6d4fd8`; amber `#fef0dc`/`#c26a0a`; red `#fde8e8`/`#d03a3a`; card border `#e6e9f1`; divider `#eef0f5`.
- Radii: buttons/inputs **10px**, cards 14–18px, pills fully round. Icons: stroke, 1.8px, `currentColor`, inside a soft-tinted rounded **square tile**.

### Buttons (`globals.css`, class `dash-action-btn` + one variant)
`dash-btn-green` (= `dash-btn-green-soft`: light green fill, dark green text), `dash-btn-danger`, `dash-btn-neutral`, `dash-btn-info`, `dash-btn-purple` — all **soft tinted fills with coloured text**; there is **no solid-green dashboard button any more** (deliberate user decision). Sizes come from the `actionBtnStyle` inline object (`padding .4rem .75rem`, weight 600, radius 10px) — do not change table button sizes. Modal buttons use `ModalButton` (`primary` = soft green, `neutral`, `danger`, `info`, `violet`). Pagination: `.generic-table-page-btn` (active = soft green).
### Capsules/pills
Status colours come from `STATUS_COLORS` in `clientStatusShared.js` (ongoing green, on_hold/approval_pending amber, under_review violet, register/scheduled blue, cancelled red; border = fill). **Phase / progress capsules are slate-soft** (`#eceff7` / `#6d7692`).

### 9a. Modal kit (`dashboardshell/pages/modalkit/`)
`ModalKit.js` (read its header comment for the design rules), `modalkit.css`, `Icon.js` (stroke icon set — add icons here). Components: `ModalShell` (props `icon|avatar, title, badges, subtitle, onClose, footer, size sm|md|lg, as/wrapperProps` for forms, `iconTone`, `headerActions`, `overlayClassName`), `ModalSection`, `ModalGrid`, `DetailList/DetailRow`, `Stat`, `StatusPill` + `STATUS_TONES`, `ModalButton`, `ModalField/ModalInput/ModalSelect/ModalTextarea/ModalPasswordInput` (these now forward `required` to the native element), `CopyButton`, `initialsOf`. Escape closes, body scroll is locked, backdrop is blurred.
Design references: `public/images/example_modal_1..5.png` (1 scheduled details, 2/3 client info, 4 edit RM form, 5 add client form).
Converted to the kit: `ClientInfoModal`, `ScheduledDetailsModal`, `DeleteConfirmModal`, Add/Edit/Info modals in `ClientsPage`, `RegistryPage` modals, `ScheduleOnboardingModal` (+`SearchableSelect`), `RMsPage` Add/Edit, `ApprovalsPage`/`UnderReviewPage` footers, `ProfilePage` edit modals, `PasswordGate`, `SubmissionViewModal`.
**Not yet converted** (still old inline-style modals): superadmin-only Add Company / Add User / Edit Company / Edit User / Edit Supervisor (`GenericTable.js`, `CompaniesPage`, `UserPage`, `SupervisorPage`), the generic row-details modal (`pagecomponents/tablemodal.js`), `LogsPage` filters.

### 9b. Client onboarding phase modals (1–6) — hard constraint
Their **width/height must not change** (`.onb-modal { width:80vw; max-width:80vw; max-height:90vh }`, header 82.8px, footer 71.6px). Restyling is scoped with the class **`.onb-v2`** added to the backdrop in `PhaseModal.js` (blurred backdrop, 18px radius, icon tile, round close). Form look lives in `onboarding.css` ("Form primitives" section): section titles with icon tile, label icon tiles, 10px inputs with green focus ring, custom radios/checkboxes (soft green + dark green tick), bordered cards (`.onb-holder-col`, `.onb-sig-block`), tables with rounded ring (`.onb-table-wrap`; outer cell borders made transparent to keep size identical). `SectionTitle` takes an `icon` prop (icons from `modalkit/Icon.js`). Phase 0 reuses the base `.onb-modal*` classes unchanged (its buttons share `.onb-modal-btn`, which uses the soft-green scheme).

## 9c. Login page (`src/app/login`) — redesigned to match `public/images/new_log_screen.png`
- `page.js` (server) renders `LoginHero` (logo, headline, description, 3 feature icons), `MidSectionRightPart` (glass card), `LoginBottomSection` (Terms/Privacy). Copy comes from `app/data/loginpagedata/loginpagedata.json`.
- Layout is drawn on the **1672×941 design canvas**: `.login-container { --u: min(100vw/1672, 100vh/941) }` and every position/size is `calc(N * var(--u))`; the stage is centred **without `transform`** (a transformed ancestor breaks `position:fixed` toasts). Below 900px it switches to a stacked layout with `--u: .95px`.
- Background: `public/images/login-bg.webp` (optimised from the supplied `login back ground.png`, which can be deleted). Card uses `backdrop-filter` glass.
- Form: `MidSectionLoginFormSection` keeps the original procedure (3 s min loader, success → `/dashboard`, `logUIAction("login_success"|"login_failed")`, toasts). New: labelled fields with leading icons, show/hide-password toggle (`LoginIcon`), gradient Log In button with arrow.
- **Intentionally removed**: "Remember me" and "Forgot password?" / reset form (RMs change passwords for users). Do **not** re-add unless asked.
- Toasts: one component `notifs/logintoast.js` (`success` green, `warning` yellow for failed login, `info` blue for "unable to login"): tinted fill, dark outline, dark text, square icon tile; rendered in a fixed top-right `.login-toasts` stack outside the glass card.

---

## 10. Change log — what was done in the last four days

Commits are all titled "added changes", so this is reconstructed from the diffs.

### 13–15 Oct (committed) — registry, scheduling, onboarding status
- **Approval workflow & registry**: `ClientProfile.status` extended; pages `ApprovalsPage`, `UnderReviewPage`, `RegistryPage`, `ClientInfoModal`, `clientStatusShared.js`; `POST/PATCH /api/clients/registry`; credentials email (`sendCredentialsEmail`, `clientRegistrationEmail`); middleware rules updated.
- **Scheduled onboarding**: `parseSchedule`, `credentialCrypto`, `dispatchScheduledOnboardings`, `api/clients/scheduled`, `api/cron/dispatch-scheduled`, `ScheduledPage`, `ScheduledDetailsModal`, `scheduling/*` (location list, time-zone utils, modal). Login blocks inactive clients.
- **Onboarding status page** (`OnboardingStatusPage` + `onboardingstatus.css`): expandable rows, progress, status menu, timeline detail.
- **Client onboarding form**: `PrerequisitesModal` + legal content (Phase 0), updates to phases 1/3/4/5, charges/terms PDFs.

### 16 Oct (this stretch — partly committed as `ba14e1e`/`a698589`, **the rest is uncommitted**)
Production-build fixes: lint errors in `dashboardshell.js`, `dashboarddetailssection.js`, `ScheduleOnboardingModal.js`; `/dashboard` wrapped in `<Suspense>`; `api/demo-users` marked `force-dynamic`.
1. **Onboarding status UI**: status dropdown z-index/blink fix (`.onbs-item:has(.onbs-status-list){z-index:30}`).
2. **Submissions section** (RM + supervisor + client): see §6 — password gate, accordion with plus button (soft-green circle, dark-green plus), phase rows with tick / "Completed at" / sub-section count / "Still in progress", view modal; client variant with Notify RM / Edit placeholders; client sidebar entry; `/api/clients/me` allowed for clients in `middleware.js` (also fixed the client onboarding page silently falling back to defaults).
3. **Modal kit + modal redesign** (§9a) across the RM and supervisor dashboards.
4. **Application-wide button/capsule restyle** (§9): global `dash-btn-*`, `STATUS_COLORS`, pagination, profile buttons, report/log buttons, onboarding modal buttons; Edit buttons and then all green buttons = soft green; phase capsules = slate-soft.
5. **Client Dashboard page** (new, `ClientDashboard.js`): welcome header + the four status cards moved out of the Onboarding page; Onboarding page now shows only the progress timeline (progress card on top, "Before You Begin" removed). Phase timeline circles = light green with dark-green number, current phase has a dark-green ring.
6. **Bug fix**: `Phase1PersonalDetails.js` `AdviserBlock` crashed (`companyName` undefined) — now receives `companyName`.
7. **Client onboarding phases 1–6 restyled** (§9b) with verified-identical modal sizes; Phase 0 untouched.
8. **Login page redesign + toasts** (§9c); removed files: `logintopsection.js`, `loginmidsection.js`, `topsectiontextcontainer.js`, `midsectionleftpart.js`, `midsectionloginformbottomline.js`, `changepasswordform.js`, `backbuttonlogin.js`; added `loginhero.js`, `loginicon.js`, `notifs/logintoast.js`; rewrote `login.css`, `loginform.css`, `loader.css`, `notifs.css`, `loginpagedata.json`.
9. `public/images`: added `example_modal_1..5.png`, `new_log_screen.png`, `login back ground.png`, `login-bg.webp`.

**Uncommitted right now: ~42 files (client dashboard, phase restyle, login, button scheme, etc.). Commit them.**

---

## 11. Known issues, risks and TODO (read before shipping)

**Security (fix first)**
1. **`/api/register` is public (listed in `PUBLIC_PATHS`) and accepts `role` from the request body.** `User`'s hook only requires `companyId` for non-superadmins, so an anonymous caller can create a **superadmin**. Remove it from `PUBLIC_PATHS`, require superadmin auth, or delete the route.
2. **`db_credentials.txt` and `cookies.txt` are tracked in git.** Treat any secret in them (and in git history) as compromised: rotate, `git rm --cached`, add to `.gitignore`.
3. `/api/demo-users` returns `passwordHash` for demo users (superadmin-only through middleware). Strip the hash.
4. Submissions "password gate" is a **UI gate only**; `/api/clients` returns the data regardless. `api/login` returns different errors for unknown user vs bad password (user enumeration).
5. `middleware.js` uses prefix matching (`/api/log` also matches `/api/logs`; handlers re-check roles).

**Functional gaps**
- Client onboarding forms (phases 1–6) are **not persisted** — no save/submit API, `onboarding.currentStep/completedSteps` never advance, so Submissions shows dummy data.
- Submissions client buttons **Notify RM** and **Edit** are placeholders (planned: email/in-app notification to the RM; Edit → open the phase form).
- Only `individual` onboarding exists; joint/corporate/trust show "coming soon".
- Remaining superadmin modals and the generic row-details modal still use the old look (§9a). The Notifications page is empty.
- Scheduled emails need the external cron (§8) — without it they are only sent when someone loads the client list. Not deployed yet.
- `OnboardingStatusPage`: "In progress" and phase capsules are both green-ish on some rows; Awaiting-registry and Scheduled share blue (user was told, no decision yet).
- Sidebar label typo "Suprevisors"; JSON file name typo `homaepagedata.json`. `lint` has 4 warnings (img tags / hook deps), 0 errors.

## 12. How to verify changes (what has worked here)

- `npx eslint src` (0 errors expected) and a production build **in a temp copy** — never run `next build` inside the repo while `next dev` is running (they share `.next` and the dev server breaks with `_document`/webpack-cache errors; fix = stop dev, `rm -rf .next`, restart).
  `rm -rf /tmp/cosmos-build && mkdir /tmp/cosmos-build && tar --exclude=.next --exclude=node_modules --exclude=.git -cf - . | tar -xf - -C /tmp/cosmos-build && ln -s "$PWD/node_modules" /tmp/cosmos-build/node_modules && (cd /tmp/cosmos-build && npx next build)`
- Visual checks: copy the repo to `/tmp/cosmos-preview`, delete `src/middleware.js` there, stub `api/me`, `api/clients`, `api/clients/me`, `api/login`, `api/log` with fixed JSON, run `npx next dev -p 3101`, then use the browser tools or headless Chrome (`/opt/google/chrome/chrome --headless=new --window-size=W,H --screenshot=out.png <url>`). Stop only the preview PIDs when done and delete the temp dirs.
- The Google Fonts request can fail in sandboxes (build retries and still passes).
- Before restyling any phase modal, measure `.onb-modal` width/height, header and footer at 1920×1080, 1440×900 and 1104×792 and compare after.
- Keep `data-log-title` attributes when moving buttons; keep inputs' `required`/handlers when restyling forms.
