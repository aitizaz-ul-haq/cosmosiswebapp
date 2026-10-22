# agent.md — Cosmosis web app: architecture, conventions and change log

This file is the hand-off for any AI coding agent (Codex, Copilot, etc.) working on this repo.
Read sections 1–9 before changing anything. Section 10 lists what was changed recently, section 11
lists known problems. Everything here was verified against the code unless marked *(not reviewed)*.

Last updated: 2026-10-22. Repo: `aitizaz-ul-haq/cosmosiswebapp`, branch `main`.

**Standing user instruction:** Whenever you change this application, update `agent.md` in the
same task before handing it back. Record the resulting behaviour, relevant files, verification
performed and remaining limitations; correct any descriptions made stale by the change. Keep
the latest handoff and change log current so GitHub Copilot or another agent can continue.

## Latest handoff for GitHub Copilot — 22 Oct 2026

- Client Onboarding now follows `public/images/client_dashbaord_new_timeline_view.png`.
  The progress card uses teal current/completed nodes, purple pending nodes, saved-completion
  check badges, outlined selected nodes and solid completed/dashed pending connectors.
  The saved current phase opens initially; phase triggers still toggle the inline panels.
- Phase details include a description, Contact RM and a scoped solid-teal Start button,
  a pale phase number, a status-colored section track, subsection labels, dashed guides and
  staggered bars. Incomplete sections use purple/lavender bars, tracks and hollow dot markers;
  completed sections use teal/mint bars and check marks based on saved completion.
  At narrow sizes the phase track scrolls inside its card and subsection bars become stacked
  full-width rows with their own labels. The decorative number is hidden on phones.
- Each subsection is a button opening the existing phase form at its matching section heading,
  scrolling and focusing that heading. Closing returns focus to the initiating subsection or
  Start button; after Next phase, it returns to the newly selected phase's Start button.
  Form overlays are portaled to `document.body` so the isolated dashboard stage/sidebar cannot
  cover them. Form dimensions remain 80vw with a 90vh maximum and existing header/footer sizes.
- Phase 0 Prerequisites now also portals its overlay to `document.body`, centered across the
  viewport above the sidebar/header. `onb-prerequisites-backdrop` shares the form overlay's
  dimming and 6px background blur. Legal document styling and scroll gates retain their rules.
- Files: `OnboardingPage.js`, `onboarding/{OnboardingTimeline,PhaseDetails,PhaseModal,PrerequisitesModal}.js`
  and `onboarding/onboarding.css` (relative to dashboard pages). Phase 0's legal reader,
  RM mail links, saved completion logic and the existing form fields remain connected.
- Form persistence and independent subsection submission are still absent; subsection status
  inherits its phase's saved submission state. Local browser checks use intercepted fixtures,
  without live database writes, email delivery or deployment.

Verification details are recorded in the 22 Oct change-log entry below.

## Previous handoff — 21 Oct 2026

- Clients-page Info dialogs use `mk-client-info-overlay`, sharing the content-stage layout
  below the header/beside the sidebar and a 1200px maximum width. Their height is fixed at
  640px, capped by available viewport height, so short and long RM remarks do not resize the
  card. Header/footer stay visible; the body scrolls through the five information sections.
  Compact rows and stacking below 1000px preserve access on small screens. This is the
  non-scheduled Info dialog in `ClientsPage.js`, distinct from `ClientInfoModal.js` used by
  approval/review/registry pages. Scheduled records retain `ScheduledDetailsModal`.
- Supervisor Clients removes the Phone column and its filter/search hint. Phone remains in
  client forms/details and the RM Clients table. `GenericTable` now forwards `className` to
  `TablePageLayout`; `ClientsPage` supplies `supervisor-clients-table` only for supervisors.
  Scoped table rules remove the 800px minimum and use standard 55px desktop rows. The 300px
  Actions column keeps all four buttons on one line; Status, Progress and Onboarding Type
  have reserved widths, and the remaining text columns share the space. Long text uses an
  ellipsis with its full value in a native hover title and in Info. `GenericTableTbody` reads
  the optional column `meta.showTitle` flag; only these supervisor text columns enable it.
  At 1100px and below, labelled records retain all eight fields and native headers; Actions
  uses the full record width so its four buttons still stay on one line.
  Files: `ClientsPage.js`, `GenericTable.js`, `styles/managementtable.css`,
  `pagecomponents/ManagementTableToolbar.js`,
  `pagecomponents/generictablecomps/generictabletbody.js` and `modalkit/modalkit.css`.
- Compact-row verification: at 1672×941, 1366×768 and collapsed-sidebar laptop all three
  fixture rows, including long names/shared lists, measure exactly 55px. In all five layouts
  (also 844×390 and 390×844) every row's Email/Edit/Info/Delete buttons share the same top
  coordinate; all 60 native button hit tests pass with no table/document horizontal overflow.
  Full name/assignment/shared values remain in native hover titles and Info; Phone remains
  absent for supervisors and present for RMs. Production build and ESLint pass with the same
  two existing lint warnings. No runtime errors; two existing table whitespace warnings remain.
  Report: `/tmp/cosmosis-supervisor-clients-compact-browser-results.json`; screenshots:
  `/tmp/cosmosis-supervisor-clients-compact-{desktop,laptop,landscape,mobile,laptop-collapsed}.png`.
  Browser data used intercepted API fixtures; no live database writes or deployment.
- Earlier Clients Info/table verification: ten Info cases compare short remarks against approximately
  10,000 characters at 1672×941, 1366×768, 844×390, 390×844 and collapsed-sidebar laptop.
  Card/header/body/footer bounds are identical for each short/long pair: 640px card height,
  reduced to 306px only for the short landscape viewport. Last remarks text and Created are
  reachable through only body scrolling; title/Email/Close remain accessible. Table wrappers
  have equal client/scroll widths at all five sizes (1312, 1006, 519, 324 and 1188px) even
  with long client/shared RM names. Eight columns remain, Phone is absent only for supervisors,
  and Phone remains in Info/Edit and the RM table. Email mailto, Info/Close/Edit and search
  filtering pass. No runtime errors; two existing table whitespace warnings remain. Full
  ESLint and an isolated production build pass with the same two existing lint warnings.
  Report: `/tmp/cosmosis-supervisor-clients-browser-results.json`; screenshots include
  `/tmp/cosmosis-supervisor-clients-{desktop,laptop,landscape,mobile,laptop-collapsed}-{short,long}.png`
  and `/tmp/cosmosis-supervisor-clients-table-{desktop,laptop,landscape,mobile,laptop-collapsed}-supervisor.png`.
  Tests use intercepted API fixtures, without live database writes or email delivery.
- RM Scheduled Onboarding's Client Schedule Details modal now uses
  `overlayClassName="mk-scheduled-details-overlay"`. It shares the company modal's 1200px
  maximum width and content-stage positioning below the top bar/beside the sidebar, with a
  shorter 640px maximum height capped by available dynamic viewport space. Header/footer
  remain visible while the body scrolls. Compact detail rows/sections reduce content height;
  section columns stack below 1000px, and credentials/location values wrap on small screens.
  Company dimensions retain their 760px cap. Files: `ScheduledDetailsModal.js` and
  `modalkit/modalkit.css`; the shared spacing variable is now `--mk-content-gap`.
- Scheduled-details verification: five browser cases at 1672×941, 1366×768, 844×390,
  390×844 and collapsed-sidebar laptop pass. All four sections/eight detail rows are reachable
  using only body scrolling; header/footer and credential actions remain accessible. Long
  96-character usernames, 94-character passwords and remarks do not cause horizontal overflow.
  Native clipboard readback, password Show/Hide, nested Edit schedule open/cancel and Close
  pass at every size. Two company Add/Edit regressions retain 1200×760 desktop dimensions.
  No runtime errors; two existing table whitespace warnings remain. ESLint and isolated
  production build pass with the same two lint warnings. Report:
  `/tmp/cosmosis-scheduled-details-browser-results.json`; screenshots:
  `/tmp/cosmosis-scheduled-{desktop,laptop,landscape,mobile,laptop-collapsed}.png`.
  API data was intercepted with local fixtures; no live credentials or database writes used.
- All dashboard main page headings now share `--dashboard-heading-size: 32px` and
  `--dashboard-heading-color: #59638f` from `.dashboard-container`. This covers every role's
  dashboard hero (including Superadmin Dashboard), Notifications, table/list pages, Profile
  Overview, Client Onboarding and the individual page's Onboarding Progress title. Removed
  the hero/table/Profile mobile size overrides so
  titles stay 32px at every viewport. Rules live in `dashboard/dashboard-ui.css`,
  `styles/{managementtable,profilepage}.css`, `onboarding/onboarding.css` and the shared shell
  stylesheet. Section/card titles and public/login page typography retain their hierarchy.
- Heading verification: 60 fixture-based browser cases cover every role's 29 sidebar
  destinations at 1672×941 and 390×844, plus the corporate onboarding branch at both sizes.
  Every main title computes to 32px and `rgb(89, 99, 143)` with no heading/document overflow.
  Superadmin Dashboard wraps cleanly onto two mobile lines. No runtime exceptions or
  unexpected console errors; three existing table whitespace warnings remain. Final isolated
  production build and ESLint pass (same two lint warnings). Report:
  `/tmp/cosmosis-heading-browser-results.json`; screenshots include
  `/tmp/cosmosis-heading-superadmin-dashboard-{desktop,mobile}.png` and
  `/tmp/cosmosis-heading-client-{onboarding,profile}-mobile.png`. API data was intercepted
  with local fixtures; no live database verification or deployment.
- Add Company and Edit Company use the scoped `mk-company-overlay`, positioned within the
  existing dashboard content stage below the header and beside the sidebar. The modal is up
  to 1200px wide and 760px tall, capped by the available dynamic viewport height with outer
  spacing. The shared header height is now `--dashboard-header-height: 60px`.
- `superadmin/SuperadminForms.js` arranges company details/address, contact/online presence,
  and branding/notes in paired sections on wide screens. Sections stack at 1000px; the
  existing field grids stack at 720px. Inputs and notes are more compact. The title, close
  button and footer remain visible while only the form body scrolls. Edit notes span both
  columns. Existing fields, validation, nested updates and submit handlers are retained.
- Shared dashboard loading now has a **1200ms minimum**, continuing while any registered
  page data source is pending. `loading/CosmosisLoader.js` displays `Loading` without dots,
  uses the application's `--sitedark` gray (`#6d7692`), and draws one continuous opaque
  1.8px circular line. The two logo circles still orbit; reduced motion disables animation.
  The overlapping dashed trail that caused uneven line weight is removed.
- Main files: `CompaniesPage.js`, `ScheduledDetailsModal.js`, `superadmin/SuperadminForms.js`, `modalkit/modalkit.css`,
  `loading/{CosmosisLoader.js,cosmosisloader.css,DashboardPageLoading.js}` and
  `../styles/dashboardshell.css` (dashboard-page-relative paths).

Verification: `npx eslint src` passes with zero errors and the same two existing warnings
(Onboarding image and Profile effect dependency). An isolated production build passes.
Ten fixture-based browser cases cover Add/Edit at 1672×941, 1366×768, 844×390 and 390×844,
plus a collapsed-sidebar laptop. Cards stay below the top bar and beside the sidebar, with
visible close/save controls, no horizontal form overflow and all fields/notes reachable by
scrolling only the form body. Create/edit retain 21/18 controls and their nested POST/PATCH
payloads. Fast data shows the loader for 1231ms; a 2100ms request keeps it visible for 2126ms.
Computed color, uniform ring, dot-free text and reduced-motion behavior pass. No runtime
exceptions or unexpected console errors; three existing `GenericTableThead` whitespace-in-tr
warnings remain. Report: `/tmp/cosmosis-company-loader-browser-results.json`; screenshots:
`/tmp/cosmosis-company-{add,edit}-{desktop,laptop,landscape,mobile,laptop-collapsed}.png`.
The preview used intercepted API fixtures; no live database writes or deployment were tested.

## Previous handoff — 20 Oct 2026

All four role home dashboards and the shared sidebar/header now follow the supplied
`RM_Dashboard_design.png`, `SUpervisor_dashbaord_design.png`, `client_dashboad_design.png`
and `Superadmin Dashboard design.png` in `public/images`.

- The sidebar is 262px on the reference desktop canvas, with the supplied gray logo, user
  identity, teal active item and lavender/wave background. It collapses on desktop and opens
  as a drawer at 760px and below. The 60px header retains menu search and provides profile,
  account/logout and notification controls. Poppins is the application-wide typeface,
  including the home dashboards, navigation, charts, controls and existing forms/modals.
- `public/images/dashboard-theme/` contains clean background crops from
  `support_image_instructions.png`; sidebar, navigation header and page title use them.
  Its README explains the two optional background assets. The supplied support sheet's wave
  differs slightly from the waves drawn in the reference screens; CSS aligns its placement.
- `pages/dashboard/DashboardUI.js` and `dashboard-ui.css` provide scoped `dsh-` hero,
  stat, chart, list, table, action, badge and donut primitives. SVG charts require no new
  dependency. The role pages no longer import the legacy role dashboard CSS files.
- RM and supervisor summaries use scoped `/api/clients` data; supervisor team totals and
  performance also use `/api/users`. RM random counts and sample people were removed.
  Chart/performance filters and all dashboard actions navigate existing pages. Supervisor
  submission rows label the recorded relationship as **Assigned RM**, since no submitter
  actor is stored. `pages/dashboard/data.js` contains these shared derivations.
- The client dashboard uses its own saved onboarding state, recorded completed phases,
  uploads and updated timestamp from `/api/clients/me`. A stored zero progress is respected;
  malformed phase numbers are clamped. The profile completion indicator counts ten personal
  information fields; it is an estimate, not a persisted backend percentage.
- Superadmin totals, company pipeline and five most recent audit records use existing APIs.
  Each request fails independently. Report rows link to the existing Reports page; system
  health/compliance metrics show unavailable because no monitoring API exists.
- RM notification cards and the formerly blank Notifications page now show dated client
  creation/submission/approval activity. This is a derived activity feed, not a persisted
  unread-notification or delivery system. The header links RMs to it.
- Existing list-page background branding, onboarding pages, phase forms and their modal
  constraints remain in place. Added buttons retain readable audit titles.
- Application-wide capsule follow-up: dashboard `Badge` now wraps the existing ModalKit
  `StatusPill`, which normalizes workflow/status labels through its shared `STATUS_TONES`.
  In progress uses `#E3F8F2` / `#17B89B`, Under review uses `#EFEAFD` / `#6D4FD8`,
  phase/progress capsules use `#ECEFF7` / `#6D7692`. Capsules are fully rounded with
  semibold labels; compact dashboard sizing remains responsive. The RM orange review
  override is removed. Pending/demo/hold remain amber, scheduling/registry blue, and
  rejected/inactive/cancelled red. Demo/request pages now use the same shared pill, legacy
  `.status-*` CSS matches the original palette, and the client modal's percentage is slate.
- Application-wide typography follow-up: the modal's Poppins family now applies to regular,
  medium, semibold and bold UI text. `layout.js` installs `--font-poppins` on `<html>`;
  `globals.css` sets the family and makes native controls inherit it. Arial overrides in
  the shell/home dashboards and SVG charts are removed. Public mobile menus, the onboarding
  information glyph and modal credential text inherit the same family; stale Geist template
  declarations and serif fallbacks are normalized. Poppins weights 100–900 remain loaded;
  existing font sizes, weight choices and modal dimensions are preserved.
  Header status capsules wrap within their available mobile space to accommodate Poppins.
  Browser platform-font inspection confirms Poppins Regular (400), Medium (500), SemiBold
  (600) and Bold (700) across all four dashboards, controls, chart labels and desktop/mobile
  modals. Desktop/laptop/mobile checks report no runtime errors; the Superadmin mobile
  content remains exactly 390px wide after the header capsule wrap adjustment.
- Follow-up runtime fix: the five new dashboard/activity loaders use an effect-local
  `active` flag during cleanup. Every asynchronous success, error and loading update checks
  this flag, so late responses cannot update an inactive effect after navigation, user
  changes or React Strict Mode remounts. Cleanup no longer aborts fetches, removing the
  reported `AbortError: signal is aborted without reason` trigger at the Superadmin cleanup.
  Requests can finish in the background after cleanup; their results are ignored. The
  supervisor loader also catches unexpected failures outside its per-request result handling.
- Logout follow-up: `dashboard/page.js` awaits successful session cleanup, prevents duplicate
  logout attempts/competing auth redirects, then uses `window.location.replace("/login")`
  to request a fresh login document. A failed cleanup keeps the current session and shows
  a retry message. The context only clears its user after a successful response, and its
  initial session-check effect ignores responses from cleaned-up Strict Mode effects.
  Middleware allows the exact `/api/logout` path without a valid token, so expired/missing
  sessions can still clear the cookie. The endpoint expires the root-path cookie with
  `maxAge: 0`, matching login's `sameSite: lax`, and returns `Cache-Control: no-store`.

Verification: `npx eslint src` passes with zero errors and two existing warnings (Onboarding
image and Profile effect dependency). An isolated production build passes. Browser fixtures
cover all roles at 1672×941, 1366×768 and 390×844, scoped content overflow, zero/empty/error
states, company/client filters, approvals/activity/profile navigation, account menus, desktop
collapse and the mobile drawer. These checks use local API fixtures and do not validate live
database records or deploy the app.

Follow-up verification: 25 focused lifecycle checks execute the actual five components'
transpiled effects with controlled response headers/bodies. They verify cleanup before
success/failure, cleanup while JSON is pending, Strict Mode setup/cleanup/setup isolation,
and normal error reporting while mounted. All pass. The temporary harness is
`/tmp/cosmosis-dashboard-lifecycle.cjs`; it requires only the already-installed Next compiler.
Twelve targeted Chrome regression cases also pass: delayed native response headers/deferred
native JSON completion, Strict Mode remounts, Dashboard/Notifications → Profile → back,
stale-response isolation, and Superadmin/Supervisor partial failures and recovery. Across
205 intercepted API requests there are no window errors, unhandled rejections or CDP errors.
The report is `/tmp/cosmosis-dashboard-abort-browser-results.json`; this fixture run did not
reproduce the original abort error before the fix, and deferred JSON completion is not a
streamed-body test. The updated isolated production build and ESLint pass.

Logout verification: seven real endpoint cases cover missing, expired and malformed tokens
and all four valid roles. Nine browser cases cover header/sidebar logout for every role and
a simulated 503 failure followed by a successful real retry. A 650ms delay confirms navigation
waits for cookie cleanup; duplicate clicks produce one request. Each success renders the
login form, removes the cookie, stays signed out after reload/back and rejects direct
dashboard navigation. All 45 document responses succeeded with zero browser runtime errors.
Report: `/tmp/cosmosis-logout-browser-results.json`; other API data uses local fixtures.
ESLint and an isolated production build pass (the same two existing lint warnings).
The running app's `/login` independently returned 200 with its form. The original reported
404 was not reproduced; the redirect race and expired-session cleanup defect are addressed.

## Previous handoff — 16 Oct 2026

Implementation baseline before this documentation update: **`17d080a` on `main`**. The working
tree was clean when this update began. Re-check `git status` before continuing; old change-log
entries describe earlier stages of development.

The latest completed work is the **client Onboarding timeline and its phase actions**:

- Clicking Phase 1–6 expands that phase's own subheadings inline. Clicking it again collapses
  the panel; selecting another phase switches panels. The layout follows
  `public/images/onboarding_detail_timeline.jpg`, with staggered gradient bars and the RM
  accordion's 800 ms height/fade animation. Reduced-motion users get immediate transitions.
- Each panel has **Contact RM**, then **Start Phase N**, before the large light-gray phase
  number. Contact RM opens the user's configured email composer addressed to the assigned RM,
  with a phase-specific subject; missing RM email disables the action. Start Phase N opens
  that phase's existing full form modal. Next phase updates the modal and expanded panel;
  closing restores focus to the corresponding Start button.
- Submitted phases use **green solid tracks and green tick icons**; pending phases use
  **red dotted tracks and red cross icons**. Submission comes from `completedSteps` or
  whole-form status `submitted`/`approved`. Viewing, starting, or moving between phases does
  not submit them. `currentStep` indicates progress only.
- Each subsection currently inherits its phase's submission status. Forms still need a
  persistence/submit API, and independent subsection submission is not tracked. Submissions
  pages still use dummy data. Phase 0 retains its existing gated legal-document reader;
  completed form phases are the current evidence that prerequisites were read.

Files to start with (dashboard paths are relative to
`src/app/dashboard/components/dashboardshell/pages/`):

| File | Responsibility |
|---|---|
| `OnboardingPage.js` | Fetches onboarding/RM contact, derives submission state, coordinates panel and modal navigation |
| `onboarding/OnboardingTimeline.js` | Phase triggers, status classes, accordion ARIA and audit titles |
| `onboarding/PhaseDetails.js` | Panel header/actions, subsection bars, green ticks/red crosses, collapsed-panel focus exclusion |
| `onboarding/onboarding.css` | Timeline/status styling, reversible animation and responsive header layout |
| `onboarding/PhaseModal.js`, `onboarding/phases/Phase1..6*.js` | Existing full forms; preserve 80vw width, 90vh maximum height and existing header/footer sizes |
| `clientStatusShared.js` | Shared phase names and `PHASE_SECTIONS` headings |
| `src/app/api/clients/me/route.js` (repo-relative) | Returns `assignedRm: { name, email }` or `null`; requires assigned user, RM role, and matching profile/token/RM tenant; safe contact projection only |

The implementation passed ESLint (0 errors, 4 existing warnings), an isolated production build,
10 mocked API checks, and fixture-based browser checks at 1440×900, 1104×792 and 375×812.
Checks covered all six forms, email link addressing, Next/close/focus, status colours, hidden
panel controls and unchanged modal dimensions. Temporary preview/build processes were stopped
and their directories removed. These were local checks; deployment and live email delivery
were not part of this work.

The user's remaining requested work is recorded in §11: onboarding persistence, internal
notifications, generated external emails, toast triggers, a complete superadmin click audit
trail, and redesigns of all four dashboards using images the user will provide. Continue from
the user's next instruction and preserve the existing phase/modal constraints in §9.

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

Class-name prefixes (keep using them): `dsh-` role home dashboards, `dash-` global buttons, `generic-table-` tables, `onbs-` onboarding
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
3. `POST /api/logout` clears the root-path cookie, including for missing/expired sessions.
   The dashboard awaits a successful response, clears context state, then replaces the
   current document with `/login`; duplicate logout/auth redirects are suppressed.
   Failed cleanup retains the session and reports an error for retry.
4. API handlers call `verifyToken(req)` (`lib/auth.js`; reads cookie, falls back to `Authorization: Bearer`).

### `middleware.js` (first line of defence)
- `PUBLIC_PATHS` (prefix match): `/login`, `/api/login`, `/api/register`, `/api/requestdemo`, `/api/cron`.
- `/api/logout` is also public by exact path match, for idempotent session cleanup.
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
| `clients/me` | GET | **client only**: own profile + onboarding + `assignedRm: { name, email } \| null` from the assigned RM in the same tenant (safe contact projection only) |
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
- **Home dashboard UI**: `pages/dashboard/DashboardUI.js`, `dashboard-ui.css` and `data.js` — shared `dsh-` primitives and real client activity/phase aggregations; each role page still owns its API fetches. `NotificationsPage` reuses the activity derivation for the RM menu.
- **Data fetching pattern**: each page `fetch("/api/...", { credentials: "include" })` in `useEffect`; no global store besides `UserContext`. Pagination/filtering is client-side (`PAGE_SIZE` 8 on list pages).
- **Page loading**: `loading/DashboardPageLoading.js` wraps the keyed destination in the content
  stage; `useDashboardPageLoading` registers pending page data. The logo stays visible for at
  least 1200ms and as long as registered data is pending. The content is inert while covered.
  Background requests and audit logging do not register as blocking data sources.
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
Client sidebar → **Onboarding** (`OnboardingPage`): a timeline of Phase 0–6. Clicking phases 1–6 toggles an inline accordion; clicking the open phase closes it, and selecting another shows that phase's own sections.
- **Phase 0** (Prerequisites, `PrerequisitesModal` + `onboarding/legal/*`): read-only legal documents. The overlay portals to `document.body` above the full dashboard, centered with the same 6px backdrop blur as the phase forms. Internal reader styling and two-document scroll gates retain their rules. **Do not restyle without being asked.**
- **Phases 1–6**: `onboarding/PhaseDetails.js` displays the selected phase's subheadings from `PHASE_SECTIONS`, following `public/images/client_dashbaord_new_timeline_view.png`: descriptions, subsection labels, a status-colored solid track, dashed vertical guides and staggered bars (purple/lavender when incomplete, teal/mint when complete). The saved current phase opens initially. Panels retain the 800 ms reversible height/fade transition; reduced-motion users get immediate transitions. Phase buttons have `aria-expanded`, `aria-controls`, focus styles and `data-log-title`; collapsed panels are inert and their action controls are excluded from keyboard focus. Narrow layouts stack subsection bars and scroll only the phase track horizontally.
- **Panel actions** (top-right, before the pale phase number): **Contact RM** opens a `mailto:` compose link addressed to the assigned RM, with a phase-specific subject (disabled if no email); **Start Phase N** opens that phase's existing full form modal from the top. Subsection buttons open the form at the matching heading and focus it. Closing restores the initiating control; Next phase updates the form and inline panel, then closes back to the new phase's Start button. Opening/viewing a form does not change submission status.
- **Submission colours**: `completedSteps` or whole-form status `submitted|approved` determines submitted phases; `currentStep` alone does not. Completed/current timeline nodes are teal, pending nodes purple; completed connectors are solid and pending connectors dashed. Incomplete detail sections use lavender fills and purple text, hollow dot markers, tracks and focus/hover accents; completed sections use mint fills, green ticks and teal tracks. Start Phase stays teal as an action. There is no subsection submission state in the model yet, so all subheadings inherit their phase's status. Phase 0 has no persisted read state; completed form phases are treated as evidence the prerequisites were read.
- **Phase forms** (`PhaseModal` + `phases/Phase1..6*.js`) cover Personal Details, Source of Wealth, Financial Profile, Risk Profile, Signature and Documentation Checklist. They use primitives in `onboarding/fields.js` (`Field`, `TextArea`, `SelectField`, `CountrySelect`, `ChoiceGroup`, `CheckRow`, `YesNo`, `SectionTitle`, `Note`). Inputs are **uncontrolled** (`name` attributes only) — nothing is saved or sent to the API yet.
- `OnboardingPage` loads `/api/clients/me` (type, onboarding, profile, assigned RM contact) and uses `onboarding.currentStep` for the highlighted node. Non-individual types show a "coming soon" message.

### Submissions (UI-only for now)
`SubmissionsPage` (RM + supervisor): password gate (`PasswordGate` → `/api/verify-password`, asked on every open; **client-side gate only**) → paginated accordion of engaged clients (ongoing/on_hold/cancelled) → per-phase rows (`PhaseRow`) → `SubmissionViewModal`.
`ClientSubmissionsPage` (client): only the client's own phase rows (no accordion/filters/gate) with **Notify RM** and **Edit** placeholder buttons in the modal (no behaviour yet).
**All submission data is generated by `submissions/dummySubmissions.js`** (phases below the client's `currentStep` = completed; the current phase = partial). Replace with real data once the form persists.

## 9. UI system and conventions (follow these for any new UI)

### Design tokens
- Font: **Poppins** (`var(--font-poppins), Arial, sans-serif`) application-wide, matching the modals. The font variable is defined on `<html>`; headings, controls, navigation and SVG chart text inherit it. Weights 100–900 are loaded by `layout.js`. Do not add separate Arial, serif, Playfair, Geist or monospace UI overrides. Root tokens in `globals.css`: `--sitegreen #21CFB2`, `--sitedark #6D7692` (slate), `--sitewhite`.
- Dashboard main page headings use `--dashboard-heading-size: 32px` and
  `--dashboard-heading-color: #59638f`, declared on `.dashboard-container`. Keep these values
  on desktop and mobile for DashboardHero, TablePageLayout, Profile Overview and Client
  Onboarding (including its Onboarding Progress title). Section/card/modal headings keep
  their existing hierarchy.
- Palette used everywhere (hex, keep consistent): ink `#1a1a1a`; slate `#6d7692`; **soft green** fill `#e3f8f2` / text+icon `#17b89b` / hover `#d3f3ea`; slate-soft `#eceff7` (hover `#e1e5f0`); blue `#e6effd`/`#3a6fd8`; violet `#efeafd`/`#6d4fd8`; amber `#fef0dc`/`#c26a0a`; red `#fde8e8`/`#d03a3a`; card border `#e6e9f1`; divider `#eef0f5`.
- Radii: buttons/inputs **10px**, cards 14–18px, pills fully round. Icons: stroke, 1.8px, `currentColor`, inside a soft-tinted rounded **square tile**.

### Buttons (`globals.css`, class `dash-action-btn` + one variant)
`dash-btn-green` (= `dash-btn-green-soft`: light green fill, dark green text), `dash-btn-danger`, `dash-btn-neutral`, `dash-btn-info`, `dash-btn-purple` — shared buttons use **soft tinted fills with coloured text**. The client onboarding panel's Start Phase button has a **scoped solid-teal override** matching the user's 22 Oct reference; do not extend it to shared/table/modal buttons. Sizes come from the `actionBtnStyle` inline object (`padding .4rem .75rem`, weight 600, radius 10px) — do not change table button sizes. Modal buttons use `ModalButton` (`primary` = soft green, `neutral`, `danger`, `info`, `violet`). Pagination: `.generic-table-page-btn` (active = soft green).
### Capsules/pills
Status colours come from `STATUS_COLORS` in `clientStatusShared.js` (ongoing green, on_hold/approval_pending amber, under_review violet, register/scheduled blue, cancelled red; border = fill). **Phase / progress capsules are slate-soft** (`#eceff7` / `#6d7692`).
Use `StatusPill` from `modalkit/ModalKit.js` (or dashboard `Badge`, which wraps it) for new
capsules. Known status text or the explicit `status` prop determines its shared tone, so
In Progress stays green and Under Review stays violet across roles and pages. `tone` is
the fallback for non-status labels; teal/mint map to green, purple to violet, orange to
amber and gray to slate. Keep phase labels/percentages slate; do not add role-specific
badge color overrides.

### 9a. Modal kit (`dashboardshell/pages/modalkit/`)
`ModalKit.js` (read its header comment for the design rules), `modalkit.css`, `Icon.js` (stroke icon set — add icons here). Components: `ModalShell` (props `icon|avatar, title, badges, subtitle, onClose, footer, size sm|md|lg, as/wrapperProps` for forms, `iconTone`, `headerActions`, `overlayClassName`), `ModalSection`, `ModalGrid`, `DetailList/DetailRow`, `Stat`, `StatusPill` + `STATUS_TONES`, `ModalButton`, `ModalField/ModalInput/ModalSelect/ModalTextarea/ModalPasswordInput` (these now forward `required` to the native element), `CopyButton`, `initialsOf`. Escape closes, body scroll is locked, backdrop is blurred.
Design references: `public/images/example_modal_1..5.png` (1 scheduled details, 2/3 client info, 4 edit RM form, 5 add client form).
Converted to the kit: `ClientInfoModal`, `ScheduledDetailsModal`, `DeleteConfirmModal`, Add/Edit/Info modals in `ClientsPage`, `RegistryPage` modals, `ScheduleOnboardingModal` (+`SearchableSelect`), `RMsPage` Add/Edit, `ApprovalsPage`/`UnderReviewPage` footers, `ProfilePage` edit modals, `PasswordGate`, `SubmissionViewModal`, and superadmin Add/Edit Company, Add/Edit User and Edit Supervisor (`superadmin/SuperadminForms.js`, `CompaniesPage`, `UserPage`, `SupervisorPage`).
Company Add/Edit uses `overlayClassName="mk-company-overlay"` and `mk-company-fields` to fit the
content stage beneath the top bar. Scheduled details uses `mk-scheduled-details-overlay`,
sharing the 1200px width/positioning while capping height at 640px (company remains 760px).
Both keep their header/footer visible and scroll the body; other modal sizes retain their rules.
Clients-page Info uses `mk-client-info-overlay` with a fixed 640px height (viewport capped),
1200px maximum width, compact rows and a scrollable body, so remarks never determine card size.
**Not yet converted** (still old inline-style modals): the generic row-details modal (`pagecomponents/tablemodal.js`) and `LogsPage` filters.

### 9b. Client onboarding phase modals (1–6) — hard constraint
Their **width/height must not change** (`.onb-modal { width:80vw; max-width:80vw; max-height:90vh }`, header 82.8px, footer 71.6px). `PhaseModal` portals its overlay to `document.body` above the dashboard stage's stacking isolation; `initialSection` optionally scrolls/focuses the matching `.onb-section-title`. Restyling is scoped with the class **`.onb-v2`** added to the backdrop in `PhaseModal.js` (blurred backdrop, 18px radius, icon tile, round close). Form look lives in `onboarding.css` ("Form primitives" section): section titles with icon tile, label icon tiles, 10px inputs with green focus ring, custom radios/checkboxes (soft green + dark green tick), bordered cards (`.onb-holder-col`, `.onb-sig-block`), tables with rounded ring (`.onb-table-wrap`; outer cell borders made transparent to keep size identical). `SectionTitle` takes an `icon` prop (icons from `modalkit/Icon.js`). Phase 0 retains the base `.onb-modal*` reader classes and soft-green buttons, but now also portals to `document.body`; its `onb-prerequisites-backdrop` shares only the form overlay's dimming/blur.

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

### 22 Oct — prerequisites modal positioning and background blur
- `onboarding/PrerequisitesModal.js` now portals its overlay to `document.body`, matching the
  form overlays so dashboard stacking isolation cannot place it behind the sidebar/header.
- Added `onb-prerequisites-backdrop` and shared the form overlay's dimming/6px backdrop blur
  in `onboarding/onboarding.css`. The card stays centered with its existing 80vw width and
  90vh maximum; the legal reader, document content, scrolling and navigation retain their rules.
- Verified body portal, full-viewport overlay/blur, horizontal/vertical centering and native
  header/body/footer/Close hit tests at 1672×941, 1366×768, collapsed-sidebar laptop, 844×390
  and 390×844. Both legal scroll gates, Next/Back/read-state retention, final Close, Escape
  and backdrop dismissal pass; Phase 1 form positioning/blur also passes. No browser runtime
  exceptions. Full ESLint passes with the existing Profile effect-dependency warning, and an
  isolated production build passes. Report: `/tmp/cosmosis-prerequisites-browser-report.json`;
  screenshots: `/tmp/cosmosis-prerequisites-{desktop,landscape,mobile}.png`.
  Browser client/user data uses fixtures and audit beacons are stubbed; no live database writes.

### 22 Oct — client onboarding timeline redesign
- Follow-up: incomplete detail sections now use purple/lavender bars, markers, track/dots,
  phase label, panel tint and hover/focus styling. Completed sections retain green/teal styling;
  Start Phase remains teal. Status still comes from saved completion, including the current phase.
  Verified the actual stylesheet in headless Chrome: pending gradient/markers/track are purple,
  submitted gradient/markers/track remain green, and both Start actions remain teal.
  Focused component lint and `git diff --check` pass. This follow-up changes CSS only.
- Implemented `public/images/client_dashbaord_new_timeline_view.png` in the client Onboarding
  page: teal/purple phase markers, completion badges, phase descriptions/actions/numbers,
  subsection headings/guides and staggered mint bars. The saved current phase opens initially.
- Connected all 21 subsection bars to their corresponding form headings with scrolling,
  heading focus and return focus. Preserved phase toggling, Contact RM, Start/Next/Close,
  the prerequisites reader, saved completion semantics and all existing form fields.
- Portaled phase forms above the shell so the sidebar cannot cover their controls, keeping
  the existing 80vw/90vh dimensions and header/footer rules. Scoped the solid-teal Start button
  to these panels. Narrow layouts retain visible phase names in a horizontally scrolling
  track and stack labelled subsection rows. Fixed flex sizing to prevent inner content clipping.
- Verified `npx eslint src` (zero errors, one existing Profile effect-dependency warning),
  an isolated production build, and fixture-based Chrome checks at 1672×941, 1366×768,
  768×1024 and 390×844, plus collapsed sidebar. All 21 form-section links, 60 subsection
  pointer hit tests, keyboard/return focus, native Start/Next/Close clicks, modal layering
  and bounds, RM contact/missing contact, legal scroll gates and saved/submitted states pass.
  Both document and dashboard content-scroller widths fit at every size; no browser runtime exceptions.
- Report: `/tmp/cosmosis-client-timeline-browser-report.json`; screenshots:
  `/tmp/cosmosis-client-timeline-{desktop,laptop,tablet,mobile}.png`, corresponding
  `-nine-sections.png` variants, `-desktop-form.png` and `-mobile-form.png`.
  Client/user data APIs were intercepted with local fixtures; no live database writes or deployment.
  The isolated preview used a dummy localhost MongoDB URI; native audit beacons could not
  connect to that database, so audit persistence was not verified by these UI checks.
  Form persistence and independent subsection completion remain existing limitations.

### 21 Oct — compact supervisor Clients rows and single-line actions
- Restored 55px desktop client rows and reserved a 300px Actions column for all four buttons
  on one line. Status/Progress/type widths stay predictable; longer name/assignment values
  display an ellipsis with a full native title and remain available in Info.
- Narrow labelled records give Actions the full row width. Phone remains removed only for
  supervisors; the fixed-size Info modal and other role tables retain their behavior.
- Verified exact 55px desktop/laptop rows, one-line action buttons at five layouts and no
  horizontal overflow, including 60 native button hit tests. Isolated build and ESLint pass
  (same two existing warnings); full values remain available through titles and Info.

### 21 Oct — stable Clients info modal and supervisor table fit
- Fixed the Clients Info dialog at 640px high (capped by available viewport space) and up to
  1200px wide within the dashboard content stage. Long remarks scroll through the body without
  growing the card; title/actions remain visible and narrow screens stack information sections.
- Removed Phone only from the supervisor Clients table and updated its search hint. Scoped
  fixed columns, wrapping values/actions and labelled records on narrow screens retain all
  remaining information without horizontal overflow. Client phone forms/details and the RM
  table retain Phone. Verification is recorded in the latest handoff.

### 21 Oct — scheduled onboarding details modal fit
- Applied the company modal's wider content-stage layout to RM Scheduled Onboarding details,
  with a 1200px maximum width, a 640px/available-viewport height cap and visible header/footer.
  Scoped compact rows, wrapping credentials/location values and stacked narrow-screen sections
  keep all details reachable through the body scrollbar. Company height remains 760px.
- Verified ESLint (zero errors, two existing warnings) and an isolated production build.
  Responsive layout and credential/edit-action browser results are recorded in the handoff.

### 21 Oct — consistent dashboard page headings
- Standardized every role's main dashboard/page title to 32px and #59638f through shared
  shell tokens. Updated dashboard heroes (including Superadmin Dashboard), list/table pages,
  Profile Overview and Client Onboarding, removing responsive size overrides.
- Verified ESLint (zero errors, two existing warnings) and an isolated production build.
  Browser verification of title styles and responsive wrapping is recorded in the handoff.

### 21 Oct — company modal fit and loading refinements
- Widened Add/Edit Company to a 1200px maximum, capped height at 760px and the available
  viewport, and anchored the overlay within the dashboard content stage under the top bar.
  Company form sections now use two columns on wide screens, with compact controls and a
  scrollable body between a persistent header/footer; responsive stacking preserves access.
- Reduced shared dashboard loading minimum from 2000ms to 1200ms without shortening pending
  data loads. Reused the shared dark-gray token, removed Loading dots and replaced the
  partial dashed logo trail with one uniform 1.8px circular line.
- Verified ESLint (zero errors, two existing warnings) and an isolated production build.
  Browser fixtures and final layout/timing results are recorded in the latest handoff.

### 20 Oct — all role dashboards and navigation redesign
- Rebuilt RM, supervisor, client and superadmin overview layouts from the four supplied design PNGs, with responsive cards, SVG charts, activity tables, quick actions and progress rings.
- Extracted the support sheet backgrounds into `public/images/dashboard-theme/`; rebuilt the common sidebar/header, account controls and mobile navigation. Corrected sidebar label casing and the Supervisors typo.
- Preserved live scoped API data and replaced random/hardcoded metrics. Added real derived client activity to the RM Notifications page and kept unavailable reporting/health data explicit.
- Added shared `pages/dashboard/` primitives/styles/data helpers. Preserved onboarding/form/modal constraints and non-home list-page branding. See the latest handoff above for verification and current limitations.

### 20 Oct — dashboard cleanup AbortError fix
- Replaced abort-driven cleanup in SuperAdmin, Supervisor, RM, Client and Notifications loaders with effect-local active guards on all asynchronous state updates. This removes the reported cleanup error trigger and prevents obsolete response/error/loading updates.
- Preserved independent Superadmin request failures and added a supervisor loader catch for unexpected failures. In-flight network requests may complete after navigation; inactive effects ignore them.
- Verified 25 controlled lifecycle cases, 12 targeted browser cases (zero browser errors/unhandled rejections), isolated production build and ESLint (zero errors, two existing warnings). See latest handoff for fixture coverage and limitations.

### 20 Oct — consistent status capsules application-wide
- Dashboard badges reuse ModalKit StatusPill and its original palette. Shared semantic mappings keep In Progress green, Under Review violet, pending/hold/demo amber, scheduled/registry blue, negative states red and phase/progress slate.
- Removed the RM orange review override, restored fully rounded semibold dashboard capsules, migrated demo/request capsules and corrected the client modal percentage to slate. Existing correct list/submission/onboarding capsules remain on the same original colors.
- Verified rendered capsule colors and desktop/mobile layouts across all four role dashboards, production build and ESLint (zero errors, two existing warnings).

### 20 Oct — one Poppins typeface across the application
- Removed the dashboard/sidebar/header/chart Arial overrides and made headings and native form controls inherit the modal's Poppins typeface. Moved the shared font variable to `<html>` for consistent inheritance throughout the app.
- Updated public mobile navigation, onboarding information/legal text, modal credential text and unused template font declarations. Existing normal-through-bold weights, font sizes and modal size constraints remain in place.
- Verified production build, ESLint (zero errors, two existing warnings), and actual browser platform fonts at 1672×941, 1366×768 and 390×844. Dashboard/sidebar/control/chart/modal text renders Poppins Regular, Medium, SemiBold and Bold. Allowed mobile header capsules to wrap to prevent overflow with the wider font; a focused 390px recheck passes. Report: `/tmp/cosmosis-font-browser-results.json`.

### 20 Oct — reliable logout navigation and session cleanup
- Await cookie cleanup before requesting a fresh `/login` document; prevent repeated logout
  calls and competing auth redirects. Failed cleanup retains authentication and allows retry.
- Allow the exact logout endpoint with missing/expired tokens, expire the root-path cookie
  explicitly, and ignore obsolete initial session-check effects.
- Verified seven real API cases and nine browser cases across four roles and both account
  menus, including delayed/duplicate requests, failed cleanup/retry, reload/back and protected
  navigation. Zero document errors or runtime errors; ESLint and isolated build pass.
  The original 404 was not independently reproduced; see the latest handoff for limits.

### 13–15 Oct (committed) — registry, scheduling, onboarding status
- **Approval workflow & registry**: `ClientProfile.status` extended; pages `ApprovalsPage`, `UnderReviewPage`, `RegistryPage`, `ClientInfoModal`, `clientStatusShared.js`; `POST/PATCH /api/clients/registry`; credentials email (`sendCredentialsEmail`, `clientRegistrationEmail`); middleware rules updated.
- **Scheduled onboarding**: `parseSchedule`, `credentialCrypto`, `dispatchScheduledOnboardings`, `api/clients/scheduled`, `api/cron/dispatch-scheduled`, `ScheduledPage`, `ScheduledDetailsModal`, `scheduling/*` (location list, time-zone utils, modal). Login blocks inactive clients.
- **Onboarding status page** (`OnboardingStatusPage` + `onboardingstatus.css`): expandable rows, progress, status menu, timeline detail.
- **Client onboarding form**: `PrerequisitesModal` + legal content (Phase 0), updates to phases 1/3/4/5, charges/terms PDFs.

### 16 Oct — dashboard, modal and login redesigns (committed)
Production-build fixes: lint errors in `dashboardshell.js`, `dashboarddetailssection.js`, `ScheduleOnboardingModal.js`; `/dashboard` wrapped in `<Suspense>`; `api/demo-users` marked `force-dynamic`.
1. **Onboarding status UI**: status dropdown z-index/blink fix (`.onbs-item:has(.onbs-status-list){z-index:30}`).
2. **Submissions section** (RM + supervisor + client): see §6 — password gate, accordion with plus button (soft-green circle, dark-green plus), phase rows with tick / "Completed at" / sub-section count / "Still in progress", view modal; client variant with Notify RM / Edit placeholders; client sidebar entry; `/api/clients/me` allowed for clients in `middleware.js` (also fixed the client onboarding page silently falling back to defaults).
3. **Modal kit + modal redesign** (§9a) across the RM and supervisor dashboards.
4. **Application-wide button/capsule restyle** (§9): global `dash-btn-*`, `STATUS_COLORS`, pagination, profile buttons, report/log buttons, onboarding modal buttons; Edit buttons and then all green buttons = soft green; phase capsules = slate-soft.
5. **Client Dashboard page** (new, `ClientDashboard.js`): welcome header + the four status cards moved out of the Onboarding page; Onboarding page shows the progress timeline (progress card on top, "Before You Begin" removed). At this stage phase circles were all green; the later submission-status change below gives pending phases red styling and submitted phases green styling.
6. **Bug fix**: `Phase1PersonalDetails.js` `AdviserBlock` crashed (`companyName` undefined) — now receives `companyName`.
7. **Client onboarding phases 1–6 restyled** (§9b) with verified-identical modal sizes; Phase 0 untouched.
8. **Login page redesign + toasts** (§9c); removed files: `logintopsection.js`, `loginmidsection.js`, `topsectiontextcontainer.js`, `midsectionleftpart.js`, `midsectionloginformbottomline.js`, `changepasswordform.js`, `backbuttonlogin.js`; added `loginhero.js`, `loginicon.js`, `notifs/logintoast.js`; rewrote `login.css`, `loginform.css`, `loader.css`, `notifs.css`, `loginpagedata.json`.
9. `public/images`: added `example_modal_1..5.png`, `new_log_screen.png`, `login back ground.png`, `login-bg.webp`.

The earlier dashboard/login changes are committed, including `2b12ab6`; the onboarding
accordion and phase actions are included in `17d080a`. Check current Git state rather than
treating historical work as uncommitted.

### 16 Oct — client onboarding phase accordion
- Client phases 1–6 expand inline to show only their own subheadings, replacing direct modal opening from the phase nodes. Layout follows `onboarding_detail_timeline.jpg` and expands/collapses with the RM timeline's animation timing. The initial all-green presentation was subsequently replaced by the red/green submission states below; full forms are accessible through Start Phase N.
- Phase 0 keeps its existing legal reader. Existing phase form components and modal dimensions are unchanged.
- Phase controls now provide explicit audit titles and accessible accordion state. The current onboarding step remains separate from the phase being viewed.
- Verified with ESLint (0 errors, 4 existing warnings), an isolated production build, and a fixture-based browser preview at 1440×900, 1104×792 and 375×812. Checked all phase headings, open/close animation, rapid toggles, keyboard controls, reduced motion and the unchanged prerequisite reader.

### 16 Oct — phase actions and submission status colours
- Added Contact RM and Start Phase N before each panel's pale phase number; Start reopens the matching existing full phase form, preserving the modal size constraints.
- Client timeline and subsection bars now show pending phases in red (dotted tracks, cross icons) and submitted phases in green (solid tracks, tick icons). Status follows recorded phase submission, not viewing/starting a form.
- `/api/clients/me` now includes safe contact details for the assigned RM, with role and tenant checks. Missing contact disables the compose action.
- Verified ESLint (0 errors, 4 existing warnings), isolated production build, 10 mocked API checks and browser checks at 1440×900, 1104×792 and 375×812. All six Start actions, mailto addressing, Next/close/focus, submission states and collapsed-panel focus exclusion passed. Original modal width/height limits and header/footer dimensions were preserved.

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
- Subsection submission status is not tracked independently; each phase's subheadings currently share its recorded submission status.
- Submissions client buttons **Notify RM** and **Edit** are placeholders (planned: email/in-app notification to the RM; Edit → open the phase form).
- Only `individual` onboarding exists; joint/corporate/trust show "coming soon".
- The generic row-details modal and Logs filters still use the old look (§9a). RM Notifications now derives recorded client activity; persisted unread notifications and delivery are still missing.
- Scheduled emails need the external cron (§8) — without it they are only sent when someone loads the client list. Not deployed yet.
- `OnboardingStatusPage`: phase capsules use slate `#eceff7` / `#6d7692`; In progress uses green `#e3f8f2` / `#17b89b`. Awaiting-registry and Scheduled share blue.
- JSON file name typo `homaepagedata.json`. `lint` has two existing warnings (Onboarding image / Profile hook dependency), zero errors.
- Generated reports and system health/compliance/session metrics have no backend; home dashboards link existing report navigation and show unavailable health values.

**User-requested upcoming work (recorded 16 Oct; implement when directed)**
- Complete onboarding persistence and the remaining finalization changes.
- Internal notifications, external email generation and toast triggers.
- Complete the superadmin audit trail for user clicks, including user name, date/time and clicked button title; build on the existing logger.
- The four role dashboard redesigns were completed on 20 Oct using the supplied images (latest handoff above).

## 12. How to verify changes (what has worked here)

- `npx eslint src` (0 errors expected) and a production build **in a temp copy** — never run `next build` inside the repo while `next dev` is running (they share `.next` and the dev server breaks with `_document`/webpack-cache errors; fix = stop dev, `rm -rf .next`, restart).
  `rm -rf /tmp/cosmos-build && mkdir /tmp/cosmos-build && tar --exclude=.next --exclude=node_modules --exclude=.git -cf - . | tar -xf - -C /tmp/cosmos-build && ln -s "$PWD/node_modules" /tmp/cosmos-build/node_modules && (cd /tmp/cosmos-build && npx next build)`
- Visual checks: copy the repo to `/tmp/cosmos-preview`, delete `src/middleware.js` there, stub `api/me`, `api/clients`, `api/clients/me`, `api/login`, `api/log` with fixed JSON, run `npx next dev -p 3101`, then use the browser tools or headless Chrome (`/opt/google/chrome/chrome --headless=new --window-size=W,H --screenshot=out.png <url>`). Stop only the preview PIDs when done and delete the temp dirs.
- The Google Fonts request can fail in sandboxes (build retries and still passes).
- Before restyling any phase modal, measure `.onb-modal` width/height, header and footer at 1920×1080, 1440×900 and 1104×792 and compare after.
- Keep `data-log-title` attributes when moving buttons; keep inputs' `required`/handlers when restyling forms.
