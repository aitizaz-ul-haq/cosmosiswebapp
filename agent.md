# agent.md — Cosmosis web app: architecture, conventions and change log

This file is the hand-off for any AI coding agent (Codex, Copilot, etc.) working on this repo.
Read sections 1–9 before changing anything. Section 10 lists what was changed recently, section 11
lists known problems. Everything here was verified against the code unless marked *(not reviewed)*.

Last updated: 2026-11-26. Repo: `aitizaz-ul-haq/cosmosiswebapp`, branch `main`.

**Standing user instruction:** Whenever you change this application, update `agent.md` in the
same task before handing it back. Record the resulting behaviour, relevant files, verification
performed and remaining limitations; correct any descriptions made stale by the change. Keep
the latest handoff and change log current so GitHub Copilot or another agent can continue.

## Latest handoff for GitHub Copilot — 26 Nov 2026

- Notifications filters omit the visible Status/Search titles while retaining accessible
  control names. The search uses Clients' filter sizing: an 840px maximum row with matching
  select widths/gaps and mobile stacking at 400px. Search/filter behavior remains in place.
- Compliance Officer Notifications loading again uses effect-local active guards, matching
  the earlier dashboard cleanup fix. Its two GETs finish in the background after navigation,
  retry or Strict Mode cleanup; obsolete successes, errors and loading updates are ignored.
  Cleanup no longer calls `abort()` for these loads, removing the reported AbortError trigger.
  Mark-as-read requests retain their existing cancellation and confirmation behavior.
  Sixteen controlled lifecycle checks, full-source ESLint and an isolated build pass; see log.

- Compliance Officer **Notifications** is now a standard table with **Title, Description,
  Date, Status (Read/Unread), Open** and the shared 10-record footer. Search covers titles,
  descriptions, dates and affected users; the Status dropdown combines All/Unread/Read with
  search. Open replaces the navigation arrow and shows a small details dialog with title,
  full description, date/time, affected user/email, current recipient and confirmed status.
- Opening an unread event saves a per-account read receipt through `/api/notification-reads`;
  only successful matching responses update Read. Read state persists in MongoDB across visits
  and is isolated by user/company. Failed loads show Retry without guessing statuses; failed
  marking leaves Unread and offers Retry in the dialog. Stale event retry reloads source data.
  `NotificationDetailsModal.js` portals to body with focus trapping/restoration and responsive
  light/dark styling. Investment Manager activity and superadmin notifications retain their views.
- `NotificationRead`, `lib/notificationReads.js` and the new GET/PATCH route store/validate a
  canonical profile ID + event kind + source timestamp key. New event timestamps start Unread;
  idempotent writes preserve first read time. Server checks actor, tenant, source event date and
  accessible client scope. Existing `clientEvents` only gains subject/event metadata; its older
  IDs, descriptions, sorting and activity destinations retain their contracts. GenericTable's
  optional `resetPaginationKey` resets custom-filter pages; other callers retain existing behavior.
- Settings accordions now open and close with reversible 320ms height and opacity
  transitions. A zero-to-one fractional grid row handles each panel's natural height;
  padding lives inside the clipped inner wrapper so closed panels leave no gap. Closed
  content becomes inert/aria-hidden immediately, and visibility hides after the closing
  animation. Reduced-motion users get immediate transitions.
- Compliance Officer Settings now starts with four compact summary cards in one horizontal
  row: **Account Status, Role, Company, Member Since**. Narrow screens scroll this row locally
  rather than stacking the cards or widening the page. Below them, **Security, Appearance,
  Personal Information, Company Information** are phone-style accordions, initially closed
  with one section open at a time. Personal/company headings have compact sibling Edit
  buttons opening the existing dialogs; missing company data leaves a notice/disabled Edit.
- `SettingsSections.js` and `styles/settings.css` own this layout. Security receives the
  existing password form from `ProfilePage`; Appearance uses one accessible Dark mode switch
  tied to the shell's persisted theme. Personal/company values stay read-only until Edit.
  The summary prefers the live company name so edits appear immediately. Other roles retain
  their existing Profile card presentation; the shared main Settings heading remains in use.
- Help's Back to top label is **14px**. The magnifying-glass control above it now enables a
  real circular **2× text-reading lens**, replacing the earlier cursor-only implementation.
  The lens follows the pointer over Help and magnifies the actual content underneath, while
  the original page retains its layout. Click the control again or press Escape to disable
  it; leaving Help also clears it. The control exposes `aria-pressed` and an active outline.
- Help now shows a circular **Back to top** button at the bottom-right after scrolling down
  more than 240px. It smoothly scrolls the actual dashboard content container to the top and
  focuses the Help heading; reduced-motion users get an immediate return. Theme-aware colors,
  mobile/safe-area positioning and extra bottom padding keep the final content accessible.
- Compliance Officer Settings now uses the shared `management-table-heading` for its title
  and introductory description, matching other pages' typography, colors, spacing and mobile
  sizing in both themes. `ProfilePage settings` omits the legacy profile header/title/subtitle
  classes; other roles' Profile presentation retains those classes.
- Onboarding Status's main title now inherits the shared `--dashboard-heading-color`
  (`#59638f` in light mode), matching other page titles. Removed the page-specific navy h1
  override from `styles/onboardingstatus.css`; existing dark heading rules still apply.
- Compliance Officer Submitted Information now uses the shared `ManagementTablePagination`
  footer below the client list, matching other tables' position, record count, page controls,
  responsive layout and light/dark styles. It retains 10 clients per page and existing filter
  resets/clamping. The Investment Manager's Submissions toolbar retains its existing pager.
- Compliance Officer **Profile** is now **Settings**, with a gear icon in both themes.
  The internal menu key remains `profile`, preserving existing header/account links and URLs.
  `SettingsPage` reuses `ProfilePage settings`: personal/company editing and password changes
  remain available, and the Appearance accordion provides a **Dark mode** toggle between
  sun/light and moon/dark labels. Both icons also appear in the officer's header. Header and Settings share the
  shell's existing persisted theme through `DashboardThemeContext`; other roles retain their
  existing Profile labels and header toggle. Account menus also say Settings for officers.
- **Help** appears directly below Settings for Compliance Officers. `HelpPage.js`,
  `complianceHelpContent.js` and `styles/help.css` document all 13 destinations, their
  functions, actions, dialog contents and data fields. Search matches section/function/action/
  field descriptions, supports multiple terms, result counts, clear and no-results states.
  The section list jumps to a focused heading; Open section navigates to the actual page.
  Reports and generated submission data limitations are stated in the guide.
- Submitted Information and Submitted Documents password prompts now portal into the current
  `.dashboard-page-view` and center within `.dashboard-content-stage`, below the header and
  beside the sidebar. They use a page-scoped nonmodal dialog; the shell stays usable while
  protected page controls remain inert. Cancel, Close and Escape return to Dashboard.
  Cancelling/unmounting aborts password verification; reopening requires verification again.
- The existing Submitted Documents flow is implemented: persisted Phase 6 client uploads,
  company-scoped document counts/storage, Review Documents radio selection, Document Viewer,
  Open Document and back/close navigation. PDFs from the private file endpoint now have a HEAD
  availability/type check plus loading/error/Retry Preview. Text previews now read a bounded
  stream (200,000 displayed characters), indicate truncation and offer Retry Preview.
- Document files are stored in MongoDB GridFS with tenant/profile/user metadata. The existing
  `/api/client-documents` officer list, `/mine` client list, `/upload` client POST and
  `/file/[id]` GET/HEAD routes have role/tenant/ownership checks. Ordinary onboarding form
  fields still lack persistence; document uploads are the implemented exception.
- Verification details and remaining limits are recorded in the 25 Nov change-log entry.

## Previous handoff — 24 Nov 2026

- All nine Compliance Officer list destinations use **10 records per page**: Investment
  Managers, Teams, Clients, Onboarding Status, Pending Approvals, Under Review, Reports,
  Notifications and Submissions. `src/lib/dashboardPagination.js` owns the role-specific size:
  `supervisor` gets 10; other roles retain 8 on paginated tables/client lists.
- GenericTable's row model and footer use the shared policy, as do the two custom client
  accordions. Compliance Officer Notifications now slices the full activity list into pages
  of 10 with the existing pagination controls; Investment Manager Notifications retains its
  full list. Filters/user/page-size changes reset the relevant page; data shrink clamps indexes.
  Reports still has no report data source and displays the existing empty state under this rule.
- Pending Approvals and Under Review Details now use `ClientInfoModal`'s `wideDetails`
  variant: a 1280px desktop maximum, two four-row information cards with intrinsic label
  minimums, stacked cards at 1100px and below, and existing mobile detail rows. This variant
  portals to body so the wider card stays above the sidebar. Remarks retain their existing
  styles; other callers retain the standard 720px dialog. Verification is in the latest log.
- Compliance Officers now have **Notifications** in the sidebar after Reports and a working
  **View recent client activity** link in the header bell menu. The existing Notifications
  page derives recorded client activity from company-scoped `/api/clients`, matching the
  Investment Manager view with company-wide subtitle/scope. No new notification API was needed.
- Compliance Officers now have **Teams** directly below **Investment Managers**. `TeamsPage.js`
  provides a searchable table, Add/Edit/View dialogs, password-confirmed deletion, **Email Team
  Leader**, and **Send message to team**. The latter opens the officer's email application with
  the leader and every member addressed; it does not send automatically or create in-app chat.
- Teams **View** uses the shared blue `management-row-action is-info` style, matching other
  tables' Info buttons in light and dark mode, including hover states.
- Teams use `src/models/Team.js` and `/api/teams` (GET/POST/PATCH/DELETE). Only role `supervisor`
  can manage teams, scoped to its JWT company. Each team has one leader and at least one
  distinct member, chosen from active same-company `rm` users. Editing can reassign the leader
  and add/remove members; team membership never changes `User.role` or client ownership.
- Team names are unique within the company after trimming, Unicode normalization and lowercasing.
  APIs validate assignment IDs, reject tenant overrides, and preserve IDs for unavailable
  accounts while omitting their contact data. UI blocks incomplete group emails and asks for
  account repair. Add/Edit/View/Delete dialogs portal to the body for correct stacking.
- New files: `src/models/Team.js`, `src/lib/teamValidation.js`, `src/app/api/teams/route.js`,
  dashboard `pages/TeamsPage.js` and `pages/styles/teams.css`. Integration adds Teams navigation,
  icon, table Add action, middleware prefix and `isActive` in the existing safe users list.
  `GET /api/users?role=rm` retains managers with missing optional email/phone details so they
  remain available for assignment; other user lists retain their existing completeness filter.
  Delete confirmations block dismissal/repeated submission while pending, surface operation errors,
  and retain the dialog for retry. Teams dialogs confine keyboard focus and make the background inert.
- Displayed designations are **Investment Manager** and **Compliance Officer** across dashboard
  navigation, profiles, user/manager administration, client workflow labels, CSV exports,
  onboarding contact actions, public/demo copy, login help and HTML/plain-text emails.
- `src/lib/roles.js` centralizes `getRoleLabel` and `formatRoleText`. Role tables, filters,
  generic details, fallback greetings and account identities display the new names; historic
  audit titles are formatted when rendered without rewriting their records.
- Persisted role codes remain `rm` and `supervisor`, and menu IDs remain `rms` and
  `supervisors`. JWTs, schema enums, authorization, tenant/ownership checks, CSS selectors,
  API request/response fields (including `assignedRm` and `rmRemarks`) and user data retain
  their existing contracts. No account migration is needed. Use the helpers whenever a
  stored role is shown to a user; never rename the stored codes as a copy change.
- Earlier handoffs and change-log entries retain the role names used at that time.
- Verification results and layout adjustments are recorded in the 24 Nov change-log entry.

## Previous handoff — 23 Oct 2026

- Dark mode now uses dedicated `dashboard-theme/sidebar-dark.webp` and `title-dark.webp`
  artwork with navy fields and luminous teal/violet waves. The sidebar uses normal blending;
  hero and management title backgrounds retain their two layers with a transparent first
  gradient so the artwork is visible. All existing background sizing/placement and light-mode
  assets remain in use. Eight focused desktop/mobile comparisons pass; see the log below.
- Dashboard dark mode is available beside Notifications in the top bar for every role,
  including mobile. The moon/sun toggle exposes its pressed state and remembers the choice
  in `localStorage` under `cosmosis-dashboard-theme`. Light remains the default.
- `useDashboardTheme.js` restores the preference after mounting, synchronizes other tabs,
  and sets `html[data-dashboard-theme]` so portaled dialogs share the palette. Storage errors
  do not prevent switching. The HTML attribute is removed when the dashboard unmounts.
- The designs in `public/images/dark mode designs/` guide colors only. Existing typography,
  geometry, content and controls retain their source rules. Dark styles are split into
  `styles/dashboard-dark.css` (tokens/shell/common actions), `dashboard-dark-cards.css`
  (overview/notifications/profile/charts), `dashboard-dark-tables.css` (tables/submissions/
  onboarding status) and `dashboard-dark-dialogs.css` (dialogs/client onboarding/forms/loaders).
  All overrides are scoped to the dark HTML attribute, including overlays outside the shell.
  Full lint and isolated production build pass with the existing Profile warning. Browser
  verification passes 54 desktop/mobile comparisons and six theme-preference/lifecycle cases;
  layout, fonts and existing background placement match light mode. Details are in the log.
- Removed the decorative bottom-right RM page icons at the user's request. The icon layer,
  wrapper and related CSS are gone; `subcomps/dashboardmenusection.js` and
  `styles/dashboardshell.css` are restored to their pre-icon versions. RM heading styling
  and the client Onboarding background/timeline fixes remain in place.
- All eight RM sidebar pages now use Scheduled Onboarding's primary heading and introductory
  description styling. The shared rules live in `pages/styles/managementtable.css`; the shell's
  `data-role="rm"` scopes DashboardHero, Profile Overview and page-specific table overrides.
  Headings use Poppins, 32px, weight 600, `#59638f`, 1.2 line height and -0.8px letter spacing.
  Descriptions use Poppins, 15px (13px at 760px and below), weight 400, `#7c88b8`, 1.6 line
  height and full opacity. Card, section and modal titles retain their existing hierarchy.
  All 24 browser comparisons across the eight pages at 1672px, 1366px and 390px match
  Scheduled exactly and pass header overflow checks. See the change-log entry for artifacts.
- Client Onboarding now shares the Submissions page background: pale blue with the soft
  gradient/title image across the top. `subcomps/dashboardmenusection.js` applies the same
  `dashboard-management-content` background class to client Onboarding, and its scoped
  `.onb-container` is transparent so the legacy background image cannot cover it.
  Focused ESLint and desktop/mobile Chrome background comparisons pass; details are below.
- Client onboarding timeline detail tags now stay inside their matching subsection columns.
  Tags, headings and dashed guides share equal column widths; each tag retains its staggered
  row with an inset for its focus outline. Entry animations move vertically within the column.
- Narrow columns place the status icon and chevron above the wrapping label. At 1100px and
  below, labelled full-width rows remain stacked and the desktop column guides are hidden.
- Files: `onboarding/PhaseDetails.js` and `onboarding/onboarding.css` under dashboard pages.
  Existing subsection actions and saved submission colors retain their behavior.
- Verification: all 42 tags (21 subsections in both submission states) pass column/content
  bounds, heading alignment and native hit checks at eight viewport/sidebar layouts. Four
  animation samples per tag also stay inside the column. Checks render the actual component
  and stylesheet with local Poppins fonts in headless Chrome; they do not exercise live API
  data or form persistence. Report: `/tmp/cosmosis-subsection-browser-results.json`; screenshots:
  `/tmp/cosmosis-subsection-{desktop,laptop,mobile}.png`. Full ESLint passes with the existing
  Profile effect-dependency warning, and an isolated production build passes.

## Previous handoff — 22 Oct 2026

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
(the main tenant is "Nemesis"). Investment Managers create clients, a Compliance Officer approves
them, the Investment Manager registers them (credentials are emailed immediately or at a scheduled time), and the
client then completes a 6-phase onboarding form. A public marketing site, a login page and a
role-based dashboard live in the same Next.js app.

Roles (`User.role`): `superadmin`, `supervisor`, `rm`, `client`. Every non-superadmin user belongs to
one `Company` (tenant). Data is scoped by `companyId`. Display `rm` as **Investment Manager**
and `supervisor` as **Compliance Officer** using `lib/roles.js`; these stable internal codes
also remain in the technical examples below.

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
  - Tenancy/ownership: `companyId`, `companyName`, `createdByUserId`, `assignedToUserId` (the Investment Manager), `isShared`, `sharedWithUserIds`, `createdByNameSnapshot`.
  - `status` (workflow, see §8): `approval_pending → under_review → register → scheduled → ongoing | on_hold | cancelled` (default `ongoing`).
  - Scheduling: `scheduledRegistrationAt` (Date, UTC), `scheduledCountry`, `scheduledCity`, `scheduledTimeZone` (IANA), `scheduledCredentialsEnc` (**`select:false`**, AES-GCM), `registeredAt`, `approvedAt`, `approvedByUserId`.
  - `onboardingType`: `individual | joint | corporate | trust`. Only **individual** has a form.
  - `onboarding`: `{ status (not_started|in_progress|submitted|approved|rejected), currentStep (1–6), completedSteps[], progress 0–100, submittedAt, approvedAt, rejectedAt, rejectionReason }`.
  - Large sub-documents for the form data (`accountHolders`, `investmentServices`, `externalAdvisers`, `sourceOfWealth`, `financialProfile`, `riskProfile`, signature, documents…). **Ordinary form fields are not written yet** (§11); Phase 6 uploads persist under `documents.uploads`.
  - `rmRemarks`.
- **Team** — `companyId`, `name`, normalized `nameKey`, exactly one `leaderUserId`, distinct
  nonempty `memberUserIds` (excluding leader), `createdByUserId`, timestamps. Unique index on
  `{companyId, nameKey}`; all assigned users must be active Investment Managers in that tenant.
- **NotificationRead** — immutable `companyId`, reader `userId`, `profileId`, event kind
  (`created|submitted|approved`), source `eventDate`, canonical `key` and first `readAt`.
  Unique `{companyId,userId,key}` index isolates read state; another index supports latest reads.
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
  - supervisor: `/dashboard, /api/users, /api/companies, /api/clients, /api/teams, /api/client-documents, /api/notification-reads, /api/me, /api/logout, /api/verify-password, /api/log`
  - rm: `/dashboard, /api/users, /api/clients, /api/notification-reads, /api/me, /api/logout, /api/verify-password, /api/log`
  - client: `/dashboard, /api/me, /api/clients/me, /api/client-documents/mine, /api/client-documents/upload, /api/client-documents/file, /api/logout, /api/log`
- **When you add an API route, add its prefix to `ROLE_RULES` or it will 403.** Handlers must still do their own fine-grained role/tenant checks.

### API surface (`src/app/api/**/route.js`)

| Route | Methods | Notes |
|---|---|---|
| `login`, `logout`, `me` (GET/PATCH profile), `me/change-password`, `verify-password` | | `verify-password` checks the logged-in user's password (used by delete confirmations and the Submissions gate) |
| `register` | POST | **Public + takes `role` from the body — see §11 (critical)** |
| `users` | POST GET PATCH DELETE | Manage Compliance Officers/Investment Managers/users within tenant rules (superadmin→Compliance Officers, Compliance Officer→Investment Managers…) |
| `teams` | GET POST PATCH DELETE | Compliance Officer only, scoped to JWT tenant; create/edit name, leader and members; `?id=` for PATCH/DELETE; safe manager contact projections; duplicate company name409 |
| `notification-reads` | GET PATCH | Compliance Officer/Investment Manager account+company-scoped receipts. PATCH validates `{profileId,eventType,eventDate}` against the accessible current source event and idempotently records first read time; stale timestamps409. |
| `companies`, `companies/[id]/users` | POST GET PATCH DELETE / GET DELETE | superadmin only |
| `clients` | GET POST PATCH DELETE | Core client list + lifecycle. PATCH `action: "approve"` → `register`; `action: "review"` → `under_review`; `{status}` for ongoing/on_hold/cancelled; Investment Managers may only change status of their own engaged clients. GET also runs `dispatchScheduledOnboardings()` as a backup trigger |
| `clients/registry` | POST PATCH | Investment Manager only. POST registers a client now, or `action:"schedule"` (stores encrypted password + schedule, `isActive=false`); PATCH edits basic details before registration |
| `clients/scheduled` | GET PATCH | Investment Manager only. GET decrypts credentials for the details modal; PATCH re-schedules |
| `clients/me` | GET | **client only**: own profile + onboarding + `assignedRm: { name, email } \| null` from the assigned Investment Manager in the same tenant (safe contact projection only) |
| `client-documents`, `client-documents/mine`, `client-documents/upload`, `client-documents/file/[id]` | GET / GET / POST / GET+HEAD | Officer company-scoped list, client's own list/upload, private GridFS file streaming with role/tenant/profile/ownership checks and byte ranges. Client uploads require active ongoing onboarding; validated file types/size and idempotent upload IDs. |
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
  - supervisor: dashboard, rms, teams, clients, onboardingstatus, approvals, underreview, reports, notifications, submissions, documents, profile (Settings), help
  - rm: dashboard, clients, registry, scheduled, onboardingstatus, notifications, submissions, profile
  - client: **dashboard, onboarding, submissions, profile**
- **Pages** (`dashboardshell/pages/`): `ClientsPage` (create/edit/info/delete clients), `ApprovalsPage` (approve/review/verify), `UnderReviewPage`, `RegistryPage` (awaiting registry: register now / schedule / edit), `ScheduledPage` + `ScheduledDetailsModal`, `OnboardingStatusPage` (expandable rows + timeline), `SubmissionsPage` (accordion, password gate), `SubmittedDocumentsPage` (document storage/review/viewer), `SettingsPage` (officer settings via `ProfilePage`), `HelpPage` (searchable officer guide), `ClientSubmissionsPage`, `ClientDashboard`, `OnboardingPage` (client phase timeline), `RMsPage`, `TeamsPage`, `SupervisorPage`, `UserPage`, `CompaniesPage`, `LogsPage`, `ProfilePage`, `ReportsPage`, role home dashboards (`RMDashboard`, `SupervisorDashboard`, `SuperAdminDashboard`), `GenericTable` + `pagecomponents/` (header, filter, thead/tbody, modal).
- **Shared logic**: `clientStatusShared.js` — `STATUS_LABELS`, `STATUS_COLORS`, `PHASE_CONFIG` (6 phases → 20/35/50/65/80/100 %), `PHASE_SECTIONS`, `getPhaseConfig`, `actionBtnStyle`, `ClientStatusBadge`, legacy modal style objects. `modalkit/` — see §9a.
- **Home dashboard UI**: `pages/dashboard/DashboardUI.js`, `dashboard-ui.css` and `data.js` — shared `dsh-` primitives and real client activity/phase aggregations; each role page still owns its API fetches. `NotificationsPage` reuses the activity derivation for Investment Manager and Compliance Officer menus.
- **Notifications**: officers use the searchable standard table and persisted per-account read
  receipts; Investment Managers retain the activity list. Events still come from client
  creation, application submission and onboarding approval timestamps, not a separate inbox
  delivery system. Opening officer details marks that event read after server confirmation.
- **Data fetching pattern**: each page `fetch("/api/...", { credentials: "include" })` in `useEffect`; no global store besides `UserContext`. Pagination/filtering is client-side. `getDashboardPageSize` (`lib/dashboardPagination.js`) sets Compliance Officer (`supervisor`) pages to 10 records and other paginated roles to 8. Compliance Officer Notifications paginates activity; Investment Manager Notifications retains its full list.
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
`approval_pending` (created by Investment Manager/Compliance Officer) → **Compliance Officer** `review` → `under_review` → **Compliance Officer** `approve` → `register` ("Awaiting registry", Investment Manager) →
Investment Manager registers: **now** → `ongoing` + `isActive=true` + credentials email; **scheduled** → `scheduled` + `isActive=false` + encrypted password stored →
dispatcher activates → `ongoing`. From `ongoing` the Investment Manager can set `on_hold` / `cancelled` (and back). Investment Managers cannot touch `approval_pending/under_review/register/scheduled`.
"Verify" in Approvals just opens `https://www.nemesisam.com/` in a new tab.

### Scheduled onboarding (credentials emailed at a chosen local time)
1. Investment Manager picks country + city (European list in `scheduling/europeLocations.js`, each city → IANA zone), date, time. `timeUtils.zonedTimeToUtc` converts to a UTC instant (rejects non-existent DST times). The UI shows AM/PM + the Investment Manager's own time before confirming.
2. `POST /api/clients/registry {action:"schedule"}` stores `scheduledRegistrationAt` (UTC), place, zone and the AES-encrypted password; client stays `isActive=false`.
3. **Nothing in the Next.js process wakes up by itself.** Delivery is triggered by (a) an **external cron** calling `GET /api/cron/dispatch-scheduled` with the bearer secret every minute, and (b) as a backup, every `GET /api/clients` (any Compliance Officer/Investment Manager/superadmin loading the list).
4. `dispatchScheduledOnboardings` atomically claims due profiles (`findOneAndUpdate` scheduled→ongoing), decrypts the password, emails the client, sets `isActive=true`, wipes the stored secret/schedule. On failure it flips the profile back to `scheduled` for retry.
5. Deployment plan: **Vercel Hobby** (cron limited to daily) ⇒ use **cron-job.org** (free, every minute, header `Authorization: Bearer <CRON_SECRET>`). The app has **not been deployed yet**; set the env vars in §2 first. Local test: loop `curl` against `localhost:3000/api/cron/dispatch-scheduled`.

### Team management
Compliance Officer sidebar → **Teams** → **Add Team**. Enter the name, select one team leader,
and use repeatable **Team Member** dropdowns/**Add Team Member** for members. The leader is
included separately and cannot also be a member. Edit supports renaming, leader reassignment
and membership changes; View lists names/emails. Deletion removes only the team record after
the existing password check. **Email Team Leader** opens one addressed email; **Send message
to team** opens one group email with unique leader/member addresses. Missing/deactivated
accounts or missing/invalid email addresses disable incomplete email actions and are shown
for repair. No automatic messages are sent. Teams are grouping records, not new user roles.

### Client onboarding form (individual only)
Client sidebar → **Onboarding** (`OnboardingPage`): a timeline of Phase 0–6. Clicking phases 1–6 toggles an inline accordion; clicking the open phase closes it, and selecting another shows that phase's own sections.
- **Phase 0** (Prerequisites, `PrerequisitesModal` + `onboarding/legal/*`): read-only legal documents. The overlay portals to `document.body` above the full dashboard, centered with the same 6px backdrop blur as the phase forms. Internal reader styling and two-document scroll gates retain their rules. **Do not restyle without being asked.**
- **Phases 1–6**: `onboarding/PhaseDetails.js` displays the selected phase's subheadings from `PHASE_SECTIONS`, following `public/images/client_dashbaord_new_timeline_view.png`: descriptions, subsection labels, a status-colored solid track, dashed vertical guides and staggered tags confined to their matching equal-width subsection columns (purple/lavender when incomplete, teal/mint when complete). Dense columns put icons above wrapping text. The saved current phase opens initially. Panels retain the 800 ms reversible height/fade transition; reduced-motion users get immediate transitions. Phase buttons have `aria-expanded`, `aria-controls`, focus styles and `data-log-title`; collapsed panels are inert and their action controls are excluded from keyboard focus. At 1100px and below, subsection tags stack as labelled full-width rows without desktop column guides; only the phase track scrolls horizontally.
- **Panel actions** (top-right, before the pale phase number): **Contact Investment Manager** opens a `mailto:` compose link addressed to the assigned Investment Manager, with a phase-specific subject (disabled if no email); **Start Phase N** opens that phase's existing full form modal from the top. Subsection buttons open the form at the matching heading and focus it. Closing restores the initiating control; Next phase updates the form and inline panel, then closes back to the new phase's Start button. Opening/viewing a form does not change submission status.
- **Submission colours**: `completedSteps` or whole-form status `submitted|approved` determines submitted phases; `currentStep` alone does not. Completed/current timeline nodes are teal, pending nodes purple; completed connectors are solid and pending connectors dashed. Incomplete detail sections use lavender fills and purple text, hollow dot markers, tracks and focus/hover accents; completed sections use mint fills, green ticks and teal tracks. Start Phase stays teal as an action. There is no subsection submission state in the model yet, so all subheadings inherit their phase's status. Phase 0 has no persisted read state; completed form phases are treated as evidence the prerequisites were read.
- **Phase forms** (`PhaseModal` + `phases/Phase1..6*.js`) cover Personal Details, Source of Wealth, Financial Profile, Risk Profile, Signature and Documentation Checklist. They use primitives in `onboarding/fields.js` (`Field`, `TextArea`, `SelectField`, `CountrySelect`, `ChoiceGroup`, `CheckRow`, `YesNo`, `SectionTitle`, `Note`). Ordinary inputs are **uncontrolled** (`name` attributes only) and are not saved. Phase 6's `ClientDocumentUploads` is the exception: its private document uploads are persisted through the document API.
- `OnboardingPage` loads `/api/clients/me` (type, onboarding, profile, assigned Investment Manager contact) and uses `onboarding.currentStep` for the highlighted node. Non-individual types show a "coming soon" message.

### Submissions (UI-only for now)
`SubmissionsPage` (Investment Manager + Compliance Officer): password gate (`PasswordGate` → `/api/verify-password`, asked on every open; **client-side gate only**) → paginated accordion of engaged clients (ongoing/on_hold/cancelled) → per-phase rows (`PhaseRow`) → `SubmissionViewModal`.
`ClientSubmissionsPage` (client): only the client's own phase rows (no accordion/filters/gate) with **Notify Investment Manager** and **Edit** placeholder buttons in the modal (no behaviour yet).
**All submission data is generated by `submissions/dummySubmissions.js`** (phases below the client's `currentStep` = completed; the current phase = partial). Replace with real data once the form persists.

### Submitted Documents (persisted uploads)
`SubmittedDocumentsPage` is Compliance Officer only: fresh page-scoped password gate →
company client table (Client Name, Documents Uploaded, Total Storage Used) → Review Documents
selection → Document Viewer. Counts and byte totals come from persisted upload records;
unknown legacy sizes are labelled rather than assumed zero. File metadata includes original
name, MIME type, bytes and uploaded time. Safe images, private PDFs and plain text can preview;
Open Document handles other supported links/types. Viewer Close returns to the selection;
Review Close returns to the table. The officer view has no upload/edit/delete actions.
Client uploads are available in Phase 6, separate from the unpersisted form fields above.

## 9. UI system and conventions (follow these for any new UI)

### Design tokens
- Dark mode uses the shared `dashboard-dark*.css` overrides under
  `html[data-dashboard-theme="dark"]`: navy canvas/surfaces, light text, periwinkle secondary
  text, and the existing semantic teal/violet/amber/blue/red accents on dark tinted fills.
  Keep changes color-only; do not copy layout/font differences from the dark reference PNGs.
  Use the `--dm-*` variables for additional dark styles. Theme scope must include body-portaled
  dialogs while remaining absent from public/login pages after dashboard unmount.
- Font: **Poppins** (`var(--font-poppins), Arial, sans-serif`) application-wide, matching the modals. The font variable is defined on `<html>`; headings, controls, navigation and SVG chart text inherit it. Weights 100–900 are loaded by `layout.js`. Do not add separate Arial, serif, Playfair, Geist or monospace UI overrides. Root tokens in `globals.css`: `--sitegreen #21CFB2`, `--sitedark #6D7692` (slate), `--sitewhite`.
- Dashboard main page headings use `--dashboard-heading-size: 32px` and
  `--dashboard-heading-color: #59638f`, declared on `.dashboard-container`. Keep these values
  on desktop and mobile for DashboardHero, TablePageLayout, Profile Overview and Client
  Onboarding (including its Onboarding Progress title). Section/card/modal headings keep
  their existing hierarchy.
- Investment Manager primary headings and introductory descriptions share Scheduled Onboarding's rule in
  `styles/managementtable.css`. Scope other header variants with the shell's `data-role="rm"`:
  heading weight 600, line height 1.2, letter spacing -0.8px; description color `#7c88b8`,
  weight 400, line height 1.6, full opacity, size 15px or 13px at 760px and below. Both inherit
  Poppins. Keep this shared source instead of adding per-page Investment Manager typography overrides.
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
Design references: `public/images/example_modal_1..5.png` (1 scheduled details, 2/3 client info, 4 edit Investment Manager form, 5 add client form).
Converted to the kit: `ClientInfoModal`, `ScheduledDetailsModal`, `DeleteConfirmModal`, Add/Edit/Info modals in `ClientsPage`, `RegistryPage` modals, `ScheduleOnboardingModal` (+`SearchableSelect`), `RMsPage` Add/Edit, `ApprovalsPage`/`UnderReviewPage` footers, `ProfilePage` edit modals, `PasswordGate`, `SubmissionViewModal`, and superadmin Add/Edit Company, Add/Edit User and Edit Compliance Officer (`superadmin/SuperadminForms.js`, `CompaniesPage`, `UserPage`, `SupervisorPage`).
Pending Approvals and Under Review opt into `ClientInfoModal wideDetails`: 1280px maximum,
body-portaled overlay, intrinsic minimum label columns in the two information cards, and
stacking at 1100px. Remarks styling and other ClientInfoModal callers retain their defaults.
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
- **Intentionally removed**: "Remember me" and "Forgot password?" / reset form (Investment Managers change passwords for users). Do **not** re-add unless asked.
- Toasts: one component `notifs/logintoast.js` (`success` green, `warning` yellow for failed login, `info` blue for "unable to login"): tinted fill, dark outline, dark text, square icon tile; rendered in a fixed top-right `.login-toasts` stack outside the glass card.

---

## 10. Change log — what was done in the last four days

### 26 Nov — Compact Notifications filters matching Clients search width

- Removed the visible Status and Search spans from `NotificationsPage.js`, retaining the
  select/input `aria-label`s. `styles/notifications.css` now matches Clients' filter row cap,
  gap, select/search flex sizing and responsive breakpoints; the desktop search is 656px
  when the row reaches its 840px cap. Existing native controls, themes and filtering remain.
- Verification: focused component ESLint and `git diff --check` pass. Headless Chrome
  measurements of both filter layouts using the actual stylesheets match at eight viewport
  widths (1672, 1366, 1100, 760, 600, 401, 400 and 390px), including stacked controls.
  Report: `/tmp/cosmosis-notifications-filter-width-results.json`. These are isolated CSS
  layout checks; no live API/database operations or deployment occurred.

### 26 Nov — Notifications loader cleanup AbortError

- Removed the load effect's AbortController, fetch signal and cleanup abort from
  `NotificationsPage.js`. Both GETs retain effect-local active checks for success, error and
  loading state; cleanup only deactivates the old effect. This restores the established
  dashboard loader pattern after the new table reintroduced abort-driven cleanup.
- Load failures still show Retry, with a fallback message even for missing rejection details.
  Read receipt PATCH requests retain their existing controller and lifecycle handling.
- Verification: **16/16** controlled lifecycle checks pass with zero unhandled rejections,
  executing the actual component with installed Next SWC and deferred headers/JSON. Cases
  cover concurrent endpoints, HTTP/network/malformed-data failures, navigation cleanup,
  Strict Mode stale success/failure and retry isolation. Harness/report:
  `/tmp/cosmosis-notifications-lifecycle.cjs` and
  `/tmp/cosmosis-notifications-lifecycle-results.json`.
- Full-source ESLint passes with the existing Profile hook warning; isolated production build
  passes with the existing `/api/logs` dynamic-render diagnostic. No browser reproduction or
  live database testing was performed. In-flight GETs can finish after cleanup; inactive
  effects ignore them. No deployment or dependency changes.

### 25 Nov — Notifications table, details dialog and persisted read status

- Replaced the officer's activity list/arrows with GenericTable columns Title, Description,
  Date, Read/Unread Status and Open, search and a combined read-status dropdown. Standard
  pagination stays below the table at 10 records/page; custom filters reset page selection
  through GenericTable's optional `resetPaginationKey`. The menu now uses the management
  page background. Responsive record layouts preserve full mobile descriptions.
- Added `NotificationDetailsModal.js` and `styles/notifications.css`: small details with
  title/full description/date-time/affected user/email/current recipient/status, pending/error
  feedback and Retry, body portal, focus trap, and correct return to the same Open control or
  Search if filtering removes that row. Closing uses Close, X, Escape or backdrop.
- Added `NotificationRead`, `lib/notificationReads.js`, GET/PATCH `/api/notification-reads` and
  middleware prefixes for supervisors/RMs. Canonical source-date keys and a unique tenant/
  account/event index preserve first read time, handle duplicate simultaneous opens, isolate
  accounts and treat later event dates as new unread activity. PATCH checks accessible client
  and actual source date; requests reject forged tenant/user fields. UI updates Read only
  after successful server confirmation and supports retry. Read receipt PATCH requests abort
  on account/navigation changes; source GETs ignore obsolete results after cleanup.
- Added subject/type metadata to `clientEvents` without changing its legacy output contract,
  and updated Help. Existing Investment Manager/superadmin Notifications presentation remains.
- Verification: full-source ESLint passes with the existing Profile hook warning; source
  review and diff checks pass. The backend audit passes **67** actual helper/model/route checks
  using mocked auth/MongoDB (`/tmp/cosmosis-notification-read-checks.cjs`). Final isolated
  production build passes with the existing `/api/logs` dynamic-render diagnostic. **13/13**
  browser cases pass with zero runtime exceptions: 19-event pagination, combined search/status
  filters, full modal fields, confirmed read persistence/account isolation, failed load/save
  retry, row removal/focus restoration, native keyboard/modal dismissal, mobile light/dark
  bounds, pending-request navigation and legacy role views. Report:
  `/tmp/cosmosis-notifications-browser-results.json`; screenshots:
  `/tmp/cosmosis-compliance-notifications-*.png` and
  `/tmp/cosmosis-compliance-notification-details-*.png`. All browser/API data operations were
  intercepted or mocked; no live database writes, email delivery or deployment occurred.
### 25 Nov — Smooth Settings accordion opening and closing

- `SettingsSections.js` keeps accordion regions mounted for reversible open/close animation,
  replacing immediate `hidden` removal with expanded state, `aria-hidden` and `inert`. Closed
  controls leave keyboard/accessibility navigation immediately while the visual panel closes.
- `styles/settings.css` animates a 0fr↔1fr grid row over 320ms with opacity easing, natural
  content height and delayed closed visibility. A min-height-zero clipped inner wrapper holds
  a separate padded content wrapper, including mobile spacing, so collapsed panels have no
  residual height. Rapid toggles reverse the transition; reduced-motion users get no animation.
- Verification: focused ESLint and diff whitespace checks pass; independent source review
  found no issues. **3/3** targeted browser cases pass with zero runtime errors: opening and
  closing each show 16 desktop/17 mobile intermediate height frames; final closed height is
  zero. Rapid reversal, section switching, immediate closed/closing focus exclusion, dynamic
  Security result content and immediate reduced-motion endpoints pass. Report:
  `/tmp/cosmosis-settings-motion-browser-results.json`; screenshots:
  `/tmp/cosmosis-compliance-settings-motion-{desktop-light,mobile-dark}.png`.

### 25 Nov — Settings summary row and phone-style accordions

- Added `SettingsSections.js` and `styles/settings.css`. Four compact summary cards precede
  all settings controls in the requested order. They stay on one row, with local horizontal
  scrolling on small screens. Page padding follows shared management-page breakpoints.
- Added initially collapsed, single-open Security, Appearance, Personal Information and
  Company Information rows. Native buttons expose expanded state and label hidden panels;
  closed controls are excluded from focus. Personal/company Edit buttons sit alongside the
  heading and open the existing dialogs without nesting buttons or toggling the accordion.
- Appearance has one accessible light/dark switch using `DashboardThemeContext`; header
  controls, saved preference and portaled dialogs share it. Information fields wrap, missing
  company data displays an unavailable state, and live company names update after editing.
- `ProfilePage.js` reuses its existing password form in the Security panel; its validation,
  request payload and personal/company edit dialogs retain their handlers. Other roles keep
  the existing Profile layout. Password eye controls now have accessible labels/pressed state
  and fields identify current/new password autocomplete. Removed the superseded appearance
  button styles from `profilepage.css` and updated the searchable Help guide.
- Verification: full-source ESLint passes with the existing Profile hook-dependency warning;
  diff whitespace checks and isolated production build pass (existing `/api/logs` dynamic
  diagnostic). Independent source review found no issues. **13/13** browser cases pass with
  zero runtime exceptions: desktop/mobile light/dark card row/order/local scroll, accordion
  defaults/order/keyboard/single-open/hidden focus, shared switch/header/persistence, mocked
  personal/company cancel/save with updated company summary, password validation/API error/
  success/show-hide, mobile expanded panels/Edit modal bounds, and RM/client/superadmin
  Profile smoke checks. Report: `/tmp/cosmosis-settings-sections-browser-results.json`;
  screenshots use `/tmp/cosmosis-compliance-settings-sections-*.png`. Requests were intercepted
  fixtures, with no live account/company/password writes, email delivery or deployment.

### 25 Nov — Actual circular Help text magnifier

- Replaced the cursor-only implementation with `HelpMagnifier.js` and
  `styles/help-magnifier.css`: a real 200px circular lens displays the Help content under the
  pointer at **2×**, preserving the source's wrapping, typography and theme. A sanitized,
  inert, aria-hidden DOM copy is clipped inside a body portal. Duplicate IDs/ARIA/form
  references and floating controls are removed from the copy; it cannot receive clicks or
  keyboard focus. The original page layout stays unchanged.
- Pointer/scroll updates use animation-frame transforms. Source resizing, search changes and
  theme changes refresh the copy. The lens stays within the visible content area and hides
  over interactive controls or outside Help. Touch contact samples text above the finger;
  lifting hides it. The existing button, second click and Escape control enable/disable;
  toggling/navigation clean up the copy, listeners, observers and pending frames.
- `HelpPage.js` now labels the control Text magnifier and mounts the component with the page
  source ref/search version. Removed the custom SVG cursor CSS and corrected the searchable
  Help guide to describe real magnification.
- Verification: full-source ESLint passes with the existing Profile effect warning; isolated
  production build passes (existing `/api/logs` dynamic-render diagnostic). Independent source
  review found no issues. **5/5** targeted browser cases pass with zero runtime exceptions:
  source/copy glyph bounds measure exactly 2× with 0px center error in desktop light/dark and
  mobile dark; scrolling/search/theme refresh, native controls/focus, accessibility exclusion,
  toggles/Escape/navigation cleanup and native touch contact/lift pass. Report:
  `/tmp/cosmosis-help-lens-browser-results.json`; screenshots:
  `/tmp/cosmosis-compliance-actual-help-lens-{desktop-light,desktop-dark,mobile-dark,mobile-touch}.png`.

### 25 Nov — Larger Help label and magnifier cursor control

- The cursor-only magnifier described in this historical entry was replaced by the actual
  reading lens above after the user clarified the intended behavior.
- Increased Back to top text from 11px to 14px and adjusted its arrow/line spacing to fit
  desktop and mobile circles. Help's floating controls now share a fixed stack with a second
  circular search/magnifying-glass button above Back to top. The magnifier stays available
  at the top of the page, while Back to top retains its scroll threshold and smooth action.
- `HelpPage.js` toggles a Help-scoped custom SVG cursor with `aria-pressed`, a selected outline
  and Escape-to-exit; unmounting removes its key listener and active page class. The header,
  sidebar and floating buttons retain normal cursors. This changes the cursor icon only,
  without enlarging page contents. The guide documents that behavior.
- `styles/help.css` keeps both controls circular with existing theme colors and safe-area
  placement, and increases bottom padding to accommodate the stack. Focused ESLint and diff
  whitespace checks pass. **3/3** targeted browser cases pass, with zero runtime exceptions:
  desktop light/mobile dark label/circle bounds, vertical button ordering, custom cursor
  scope, click/second-click/Enter/Escape toggling, smooth Back to top/focus and key-listener
  cleanup on navigation. Report: `/tmp/cosmosis-help-magnifier-browser-results.json`;
  screenshots: `/tmp/cosmosis-compliance-help-magnifier-{desktop-light,mobile-dark}.png`.

### 25 Nov — Help Back to top button

- Added a circular, labelled Back to top control in `HelpPage.js`, fixed to the bottom-right
  after the dashboard's `.dashboard-menus-section` scrolls more than 240px. It scrolls that
  content container smoothly to zero and focuses the Help heading without jumping; reduced
  motion selects immediate scrolling. The passive scroll listener is removed on unmount.
- `styles/help.css` supplies light/dark colors from existing Help variables, desktop/mobile
  circle sizes, safe-area offsets and bottom padding so the last article remains readable.
  `complianceHelpContent.js` documents the new control as a searchable Help function.
- Verification: focused Help/content ESLint and diff whitespace checks pass. **5/5** targeted
  browser cases pass with zero runtime exceptions: desktop/mobile light/dark circle bounds,
  visible label/arrow, mouse/Enter activation, intermediate smooth-scroll positions, immediate
  reduced-motion return, Help heading focus, hidden state at the top and listener cleanup on
  navigation. Report: `/tmp/cosmosis-help-top-browser-results.json`; screenshots:
  `/tmp/cosmosis-compliance-help-back-top-{desktop,mobile}-{light,dark}.png`.

### 25 Nov — Settings title and description styling

- `ProfilePage.js` explicitly imports `styles/managementtable.css` and uses its shared
  `management-table-heading` header when rendering Settings. The title now has the standard
  32px/600-weight gray/slate styling, line height, letter spacing and margin; the description
  uses the standard color, full opacity, 15px desktop/13px mobile size and 1.6 line height.
  Shared theme rules supply the dark palette. Other Profile headers retain their classes.
- Verification: focused ESLint passes with the existing Profile hook-dependency warning,
  diff whitespace checks pass, and the shared light/dark/mobile heading cascade was reviewed.
  No account controls, data or persistence behavior changed.

### 25 Nov — Onboarding Status title color

- Removed the `.onboarding-status-table-page .management-table-heading h1` navy override
  from `pages/styles/onboardingstatus.css`. The heading now uses the same shared gray/slate
  token as other light-mode page titles; the existing dark-mode heading rule remains in use.
- Verification: checked the shared heading/token and dark-mode cascade and passed diff
  whitespace checks. This is a CSS-only correction; no runtime or data behavior changed.

### 25 Nov — Submitted Information pagination footer

- Moved the Compliance Officer pager from the top-right search toolbar to the bottom of the
  client list in `SubmissionsPage.js`, reusing `ManagementTablePagination` and the standard
  table footer styles. Counts, page selection, First/Prev/Next/Last, empty-result behavior,
  10-client pages and search resets use the existing pagination state. The footer stays hidden
  while locked/loading. Investment Manager Submissions retains its current toolbar pager.
- Verification: focused ESLint and diff whitespace checks pass; source review confirms the
  footer follows the list/empty state inside the same table panel as other tables. No API,
  data or stylesheet changes were required.

### 25 Nov — Compliance Officer Settings, Help and protected pages

- Renamed the officer's Profile destination to Settings and added matching gear/Help SVGs.
  Settings and the header provide both sun/light and moon/dark controls, using the same theme
  state/localStorage preference. Other roles retain their existing profile presentation.
- Added searchable Help for every officer destination, including function headings, dialog
  fields/actions, page-opening links, keyboard-friendly section jumps, result counts and
  clear/no-results states. The guide identifies Reports and sample submission limitations.
- Repositioned both password gates into the content stage. Cancel, Close and Escape return
  to Dashboard; cancellation aborts pending verification. Sidebar/header remain accessible,
  and entering either section again creates a fresh locked gate.
- Audited the existing document upload/list/private-file/review/viewer implementation.
  Added PDF preflight/loading/failure/retry and text preview retry with bounded streaming.
  Corrected this handoff's stale claim that no onboarding data is persisted: Phase 6 document
  uploads are already stored in GridFS; other form fields and phase submissions are not.
- Verification: full source ESLint passes (zero errors, the existing `ProfilePage`
  hook-dependency warning); the final isolated production build passes. The build retains
  the existing `/api/logs` dynamic-render diagnostic while completing successfully.
- Browser verification passes **25/25 cases**, with zero runtime exceptions: all 13 Help
  destinations and 61 function/data descriptions, modal/action/field search, no-results/reset,
  index focus and section links; both Settings/header themes and persisted preference; ten
  desktop/collapsed/mobile/landscape gate layouts in light/dark mode, stage bounds/centering,
  initial input focus, Cancel→Dashboard, wrong/correct password, reopening lock, X/Escape,
  sidebar navigation and pending-verification abort; document list Retry, selection/image/
  Open Document/back/focus, escaped text, PDF HEAD failure/retry/iframe and unavailable file
  fallbacks. Report: `/tmp/cosmosis-compliance-browser-results.json`; screenshots use
  `/tmp/cosmosis-compliance-{settings-desktop,help-*,gate-*,viewer-*}.png`.
- `/tmp/cosmosis-document-audit.cjs` additionally passes 44 actual helper/route checks using
  mocked DB/GridFS/auth dependencies (normalization, URL safety, MIME/size limits, byte ranges
  and scoped file GET/HEAD). These checks did not connect to MongoDB or perform real GridFS
  writes. All browser data and file responses were intercepted fixtures; no live database
  writes, email delivery or deployment were performed.

Commits are all titled "added changes", so this is reconstructed from the diffs.

### 24 Nov — 10 records per Compliance Officer page

- Centralized the page-size policy in `src/lib/dashboardPagination.js`: role `supervisor`
  uses 10 records; other paginated roles keep 8. `GenericTable` reads this policy for both
  its TanStack row model and footer, covering Investment Managers, Teams, Clients, Pending
  Approvals, Under Review and Reports. Its page resets when the role's size changes.
- Updated the separate Onboarding Status and Submissions accordions to use the same policy
  for slices, page counts, displayed ranges and controls. SubmissionsPagination receives its
  size explicitly. Filters and identity/page-size changes reset pages; data shrink clamps
  page indexes so a removed last page cannot leave a blank view.
- Compliance Officer Notifications now paginates the entire recorded client-activity list,
  10 events at a time, using ManagementTablePagination. Loading/errors clear stale events
  and totals. Investment Manager Notifications continues showing its complete list.
- Reports still has its existing empty data source; its shared table is configured for the
  10-record policy when report data is added. No placeholder records or report API were added.
- Verification: full lint, isolated production build and diff check pass with the existing
  Profile dependency warning and `/api/logs` static-analysis diagnostic. Browser report
  `/tmp/cosmosis-compliance-pagination-browser-results.json`: **14 cases pass, zero runtime
  or console errors**. Eight populated officer lists with 23 test records split **10/10/3**
  with correct ranges, page indicators, boundary buttons, no overlap/missing records, and
  filter resets where search is available. Reports' empty state, three Investment Manager
  8/8/7 regressions and mobile Teams/Notifications pass. A focused Pending Approvals recheck
  uses the existing page heading in `/tmp/cosmosis-compliance-pagination-approvals-recheck-results.json`.
  APIs were intercepted with fixtures; no live data mutations or deployment. Preview stopped.

### 24 Nov — wider approval/review details and Compliance Officer Notifications

- Pending Approvals and Under Review now opt into `ClientInfoModal wideDetails`, using a
  1280px desktop maximum so the eight entries in the two information cards have room on
  single lines. Labels use intrinsic minimum widths so Investment Manager name cannot overlap
  its value. The two cards stack at 1100px and below; existing mobile label/value stacking
  and wrapping for unusually long values remain available. Remarks styles/content are unchanged.
- The wide variant portals to `document.body`, keeping the wider card above the sidebar.
  Other ClientInfoModal callers retain their default size. Changes live in `ClientInfoModal.js`,
  `ApprovalsPage.js`, `UnderReviewPage.js` and `modalkit/modalkit.css`; the tablet grid override
  uses `.mk-grid.mk-approval-details-grid` so later `.mk-cols-2` rules cannot override it.
- Added Compliance Officer Notifications after Reports in `dashboard/config.js`. The header
  bell now links to recent activity for both Investment Managers and Compliance Officers.
  Existing `NotificationsPage.js` shows company-wide client activity for Compliance Officers
  from their scoped `/api/clients` response, with a company-specific subtitle; no API changes.
- Verification: focused ESLint, full isolated production build and `git diff --check` pass.
  Existing Profile hook warning and `/api/logs` static-analysis diagnostic remain unchanged.
  Browser report `/tmp/cosmosis-approvals-width-browser-results.json`: **9 cases, zero failures,
  runtime exceptions or console errors**. Four Pending Approvals sizes (1672/1366/1024/390px),
  three Under Review sizes (1366/1024/390px), and desktop/mobile Notifications sidebar/page/bell
  navigation pass. All eight sample labels/values stay on one text line without clipping or
  overlap; tablet cards stack, mobile stays within viewport, and remarks retain font/wrapping.
  Screenshots `/tmp/cosmosis-approvals-1672-details-width.png` and
  `/tmp/cosmosis-approvals-mobile-details-width.png`. Checks use mocked APIs with real compiled
  UI/middleware, no live data mutations or deployment. Isolated preview server was stopped.

### 24 Nov — Teams View button color

- Changed the View button in `pages/TeamsPage.js` from `is-neutral` to the shared `is-info`
  variant used by Clients Info. Existing light/dark colors and hover rules now apply.
- Verification: focused TeamsPage ESLint and `git diff --check` pass. This class-only change
  uses existing styles; no new CSS or behavior changes.

### 24 Nov — Compliance Officer Teams

- Added **Teams** immediately below **Investment Managers** in the Compliance Officer sidebar,
  with a matching icon, navigation search entry, management-page background and **Add Team**.
  The table searches team name, leader or members, and provides **Email Team Leader**, Edit,
  View and password-confirmed Delete. Teams are saved in MongoDB as company-scoped records.
- Add/Edit dialogs have Team Name, one Team Leader dropdown and repeatable Team Member
  dropdowns with **Add Team Member**/remove controls. Only active same-company Investment
  Managers are eligible; leader/member overlap and duplicate members are excluded. Editing
  supports leader reassignment, renaming and membership changes, retaining forms on errors.
- View lists the leader and every member's name/email. **Send message to team** opens the
  officer's email app with all unique leader/member addresses and an encoded team subject,
  as explicitly requested. Leader email is a separate mailto action. Missing/invalid email or
  unavailable accounts block incomplete group emails with an explanation; no email is sent
  automatically. Participant roles and client ownership are unaffected by team assignment.
- New model/API/validation: `src/models/Team.js`, `src/lib/teamValidation.js`,
  `src/app/api/teams/route.js`. Only authenticated `supervisor` can access, scoped to its JWT
  company; strict form/ID/assignment validation, one leader plus >=1 distinct member, safe
  contact projections and unique normalized company/team-name index. `PATCH?id=` allows
  partial edits, `DELETE?id=` returns 404 for missing/foreign records, duplicate names return 409.
- New UI: `pages/TeamsPage.js`, `pages/styles/teams.css`. Dialogs portal to body, trap keyboard
  focus, make the background inert and restore matching row-action focus after table remounts.
  Responsive records below 1250px retain all actions; notices and modals support dark mode.
- Shared integrations: dashboard config/page/menu/icon, GenericTable `onAddTeam`, toolbar
  placeholder, middleware `/api/teams` for Compliance Officers. Users-list projection now
  includes `isActive`; `role=rm` lists preserve managers with optional missing email/phone.
  Existing other user-list completeness behavior remains. DeleteConfirmModal blocks dismissal
  and duplicate submissions while pending, disables password edits and reports server errors.
- Verification: final isolated production build and full lint pass with the existing Profile
  hook-dependency warning and existing `/api/logs` static-analysis diagnostic; diff check passes.
  **85/85** actual Teams handler/helper/schema checks with real JWT/NextResponse and mocked DB,
  plus **12/12** actual users-list handler checks pass. Scripts/reports:
  `/tmp/cosmosis-teams-api-test.cjs`, `/tmp/cosmosis-teams-api-results.json`,
  `/tmp/cosmosis-team-manager-users-test.cjs`, `/tmp/cosmosis-team-manager-users-results.json`.
- Final Chrome report `/tmp/cosmosis-teams-browser-results.json`: **34 cases, zero failures,
  runtime exceptions or console errors**, at 1366×941 and 390×844. Covers eligibility, single
  leader/dynamic member rows, create/search/view/edit/reload/delete, failed save/delete retries,
  password failures, pending-delete close/double-submit guards, mailto recipients, focus
  confinement/return, loading recovery, empty/no-manager states and dark details. Screenshots
  `/tmp/cosmosis-teams-*.png`. APIs used intercepted test records; no live DB writes, external
  mail application launch, email delivery or deployment. Temporary preview server was stopped.

### 24 Nov — Investment Manager and Compliance Officer designations

- Replaced displayed Relationship Manager/RM/RMs and Supervisor/Supervisors designations
  throughout dashboard headers/sidebar/search, management forms/tables/profiles, client
  assignments/remarks/approval guidance, onboarding contact/notify/report actions, CSV labels,
  login guidance, public/demo content, legal-reader contact copy and HTML/plain-text emails.
- Added `src/lib/roles.js` (`ROLE_LABELS`, `getRoleLabel`, `formatRoleText`). Shared account
  identity, role columns, generic details and role filtering display/search full names.
  Historic log/action titles are translated only for display; stored audit records are intact.
  Dashboard loader announcements now use the configured page label instead of menu IDs.
- Existing `rm`/`supervisor` schema values, JWTs, permission/tenant/ownership rules, menu IDs,
  API fields and CSS/component identifiers remain compatible. No data migration was performed
  or needed. Creation forms still submit those existing role values under the new labels.
- Longer account-role text wraps within its sidebar identity column; the account trigger
  grows from its existing 53px minimum so full names cannot overlap the chevron.
- Relevant files: `src/lib/roles.js`; dashboard `config.js`, shared shell/table/identity
  components and affected pages; `styles/dashboardshell.css`; registration email builder;
  user/client/demo API copy; public demo form, homepage JSON and login help notice.
- Verification: full `npm run lint` and isolated production build pass. The existing Profile
  effect-dependency warning remains; build also reports existing Browserslist and dynamic
  `/api/logs` static-analysis diagnostics while completing successfully. Role-label/helper
  and email/marketing assertions pass; review confirms authorization logic and schemas are
  unchanged. `git diff --check` passes.
- Final browser report: `/tmp/cosmosis-role-browser-results.json`, **35 cases, zero failures,
  runtime exceptions or console errors**. Real compiled app/middleware rendered all four roles
  at 1366×941 and 390×844, plus client onboarding at 1150px. Checks cover full account/sidebar
  names, profiles, both role-name searches, Add User labels with original submitted codes,
  manager/client creation labels, expanded onboarding status and client contact action.
  Screenshots are `/tmp/cosmosis-role-*.png`. APIs were intercepted with fixtures; no live
  database writes, email delivery or deployment occurred. Preview used an isolated temp copy.

### 23 Oct — dark sidebar and title background artwork
- Replaced dark mode's multiply-darkened sidebar and heavily masked light title image with
  dedicated dark sibling assets, guided by the supplied references. Built-in imagegen edited
  the existing backgrounds into navy/teal/violet artwork; no UI, text or logos are baked in.
- `styles/dashboard-dark.css` selects `sidebar-dark.webp` with normal blending and uses
  `title-dark.webp` for the management header band. `dashboard-dark-cards.css` selects the same
  title asset for dashboard heroes. Transparent first gradient layers retain the original
  second image layer's sizing/position/repeat configuration. Light mode retains the originals.
- Browser canvas exports produce a 674×1626 sidebar and a 1376×130 title (generated blank
  title padding removed). The final WebP assets total 165,628 bytes. Original generated PNGs
  remain in the built-in generation directory; temporary project copies were moved to
  `/tmp/cosmosis-dark-art-source-zYWyTa`. Provenance, exact prompts and export settings live
  in `public/images/dashboard-theme/{README,dark-background-prompts}.md`.
- All eight final focused comparisons pass at 1672×941 and 390×844: RM Dashboard, Clients,
  Submissions and client Onboarding. Geometry/fonts/background size, position and repeat
  match light mode; dark images load with expected dimensions, original light URLs remain,
  and the sidebar uses normal blending. No bright surfaces, errors or document overflow.
  Visually reviewed desktop Clients and the mobile open drawer; title waves now fill the
  existing 172px management band. CSS parsing and `git diff --check` pass. This asset/CSS-only
  follow-up did not repeat the production build or broad theme preference suite.
- Focused report: `/tmp/cosmosis-dark-background-results.json`; screenshots:
  `/tmp/cosmosis-dark-mode-desktop-rm-{dashboard,clients}.png` and
  `/tmp/cosmosis-dark-mode-mobile-navigation-background.png`. Preview uses intercepted
  fixtures; no live database writes, email or deployment.

### 23 Oct — persistent dashboard dark mode
- Added a moon/sun toggle immediately after Notifications in the top bar, including phones.
  Its stable accessible name is `Dark mode`, with `aria-pressed`, a mode-specific tooltip
  and readable audit title. `DashboardShell` uses `useDashboardTheme.js` and passes the
  state/action through `DashboardDetailsSection` to `DashboardHeaderSection`.
- Light is the default; `cosmosis-dashboard-theme` stores the explicit choice locally.
  The hook restores on client mount, handles storage events/failures and removes the HTML
  theme attribute when leaving the dashboard. Root-scoped colors also cover body portals.
- The twelve supplied dark-mode reference PNGs guide a navy palette, light primary text,
  periwinkle secondary text and semantic teal/violet/amber/blue/red accents. Added four
  `dashboard-dark*.css` files for shell/common actions, overview/profile/charts, tables/
  submissions/staff onboarding, and dialogs/client forms/legal readers/loaders. Existing
  sidebar/logo/background assets receive color adjustments; their layout and cropping stay
  in the source styles. No new reference-layout elements or corner icons were added.
- CSS parsing, dark-scope and property audits pass: overrides contain paint properties and
  theme variables only, without typography, spacing or dimension rules. Original shadows
  retain their dimensions. Narrow `!important` rules only replace existing inline colors.
  Primary filter buttons and the scoped solid-teal Start Phase action keep their hierarchy.
- All 54 fixture-based Chrome comparisons pass at 1672×941 and 390×844. Coverage includes
  all four home dashboards, all eight RM pages, Add/Edit Client, Scheduled Details, Submissions
  gate, Superadmin Users/Companies and dialogs, plus client Onboarding, portaled phase form,
  prerequisites/legal reader and Submissions. Visible layout/font metrics match light mode;
  eight additional comparisons included background size/position/repeat, preserving the
  management pages' existing 172px top image band. No major light surfaces, horizontal
  document overflow or runtime errors were detected. Existing table whitespace warnings remain.
- Six preference/lifecycle cases pass: default light, persisted dark reload, persisted return
  to light, cross-tab storage event, switching with storage blocked, and logout attribute
  cleanup. Visually reviewed RM dashboard/Add Client, client Onboarding and mobile phase form.
  Report: `/tmp/cosmosis-dark-mode-browser-results.json`; screenshots:
  `/tmp/cosmosis-dark-mode-{desktop,mobile}-*.png`.
- Full ESLint passes with the existing Profile hook warning. Final isolated production build
  passes in `/tmp/cosmosis-dark-build-nfl0i2h0`; all 273 source files match the workspace.
  The existing `/api/logs` dynamic-render diagnostic remains. Preview/build use dummy env
  values and intercepted API fixtures, without live database writes, email or deployment.

### 23 Oct — RM page icons in the bottom-right corner
- **Removed in follow-up at the user's request.** Restored the pre-icon menu-section markup
  and stylesheet, removing the decoration and its wrapper. Focused ESLint and
  `git diff --check` pass; both source files match the pre-icon committed versions.
  The original implementation/verification below is historical and no longer active.
- Added an RM-only `dashboard-page-frame` around the existing scroll container in
  `subcomps/dashboardmenusection.js`. Its decorative layer reuses `DashboardShellIcon` with
  the active page key, exactly matching each page's sidebar SVG.
- `styles/dashboardshell.css` anchors the layer to the visible page area, clips the icon
  using a 30% translation on both axes (49% of its rectangle remains visible), and sizes it
  at 180–240px or 150px on mobile. Color `#00c4b0` matches the selected menu's darker gradient
  endpoint at 18% opacity. The layer ignores pointer events, is hidden from assistive
  technology and has no focus target; its z-index stays below dialogs and the shared loader.
  Other roles keep their previous layout and do not render the icon.
- Verified all eight RM pages at 1672×941 and 390×844: matching SVG markup, exact clipping,
  fixed corner position before/after scrolling, hidden overflow and accessibility attributes.
  Six additional checks cover native corner clicks, password-gate stacking and absence for
  client/supervisor. The mobile dashboard scrolls 760px while its icon remains fixed; shorter
  fixture pages need no outer scrolling. No verification/runtime errors or page/document
  horizontal overflow; existing GenericTable whitespace warnings remain.
- Visually reviewed desktop Dashboard and mobile Scheduled screenshots. Report:
  `/tmp/cosmosis-rm-corner-browser-results.json`; screenshots:
  `/tmp/cosmosis-rm-corner-{desktop,mobile}-{dashboard,scheduled}.png`.
  Full ESLint and an isolated production build pass with the existing Profile hook warning,
  Browserslist notice and `/api/logs` dynamic-render diagnostic. Preview/build copies use
  dummy environment values and browser fixtures; no live database writes or deployment.

### 23 Oct — standardize all RM page headings and descriptions
- Scheduled Onboarding's `.management-table-heading` is now the shared typography source
  for all eight RM sidebar pages: Dashboard, Clients, Awaiting Registry, Scheduled,
  Onboarding Status, Notifications, Submissions and Profile Settings. `DashboardShell`
  exposes `data-role`, and grouped RM selectors cover hero/profile headers plus table-page
  overrides, including Onboarding Status and Submissions' former custom title colors.
- Titles inherit Poppins at 32px/600, `#59638f`, line height 1.2 and letter spacing -0.8px.
  Descriptions inherit Poppins at 15px/400, `#7c88b8`, line height 1.6, normal letter spacing
  and full opacity, becoming 13px at 760px and below like Scheduled. Smaller card/section/modal
  typography retains its hierarchy; other roles' hero/profile overrides retain their styles.
- Files: `dashboardshell.js` and `pages/styles/managementtable.css` relative to
  `src/app/dashboard/components/dashboardshell/`. Full ESLint passes with the existing
  Profile effect-dependency warning. An isolated production build passes in
  `/tmp/cosmosis-rm-heading-build-ybigktfc` with the existing Browserslist notices and
  `/api/logs` dynamic-render diagnostic. Preview/build copies exclude local credentials;
  the browser preview uses intercepted fixtures, without live database writes or deployment.
- Browser verification covers all eight pages at 1672×941, 1366×768 and 390×844 using native
  sidebar navigation and the existing Submissions password gate. All 24 comparisons match
  Scheduled's computed family, size, weight, color, line height, letter spacing and opacity,
  with no header overflow. Desktop dashboard and mobile profile screenshots were visually
  reviewed. Report: `/tmp/cosmosis-rm-typography-browser-results.json`; screenshots:
  `/tmp/cosmosis-rm-typography-{desktop,mobile}-{dashboard,submissions,profile-settings}.png`.
  Six supervisor/client regression samples also pass, with their hero/profile weights and
  page-specific colors retained. No browser runtime errors or document overflow; existing
  GenericTable whitespace warnings remain. All 93 API requests used local fixtures.

### 23 Oct — match client Onboarding and Submissions backgrounds
- Client Onboarding reuses the shell background class already used by Submissions, so the
  background color, gradient, title image, size and position come from the same CSS rule.
  The scoped Onboarding container resets its entire background to transparent, removing
  its inherited `/images/background.png` layer as well as its former solid color.
- Files: `subcomps/dashboardmenusection.js` and `pages/onboarding/onboarding.css`, relative
  to `src/app/dashboard/components/dashboardshell/`. Cards and forms retain their styles.
- Focused component ESLint and `git diff --check` pass. Chrome comparisons using the actual
  shell component/styles at 1672px and 390px confirm identical computed backgrounds for
  Onboarding and Submissions, transparent Onboarding content and no document overflow.
  Visually checked the desktop result. Report: `/tmp/cosmosis-onboarding-background-results.json`;
  screenshots: `/tmp/cosmosis-onboarding-background-{desktop,mobile}.png`.
  This presentation-only follow-up did not rerun the production build or use live API data.

### 23 Oct — confine timeline tags to their subsection columns
- Replaced the 24-track grid and nine-track tag spans with one equal-width grid column per
  subsection. Aligned the heading grid with the tag grid and dashed guides, retaining staggered
  rows and adding an inset so tags and focus outlines stay inside their own columns.
- Added a 180px container query for readable wrapping in dense columns. Entry motion is now
  vertical, and stacked layouts hide the desktop guides.
- Verified all six phase panels in both submission states at 1920, 1672, 1366, 1101, 1100,
  768 and 390px, plus a collapsed-sidebar 1366px case. All 336 tag bounds/content/hit checks
  and 1,344 animation-position samples pass with no horizontal document overflow. Visually
  reviewed desktop and mobile screenshots. This is an isolated rendering of the actual
  component/styles/fonts; existing form navigation was not re-tested against live data.
- Full ESLint: zero errors, one existing Profile hook warning. Isolated production build:
  passed in `/tmp/cosmosis-timeline-build-jhjszjuq`, with existing Browserslist notices and
  the `/api/logs` dynamic-render diagnostic. Browser report:
  `/tmp/cosmosis-subsection-browser-results.json`; screenshots:
  `/tmp/cosmosis-subsection-{desktop,laptop,mobile}.png`. No deployment or database writes.

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
- Ordinary client onboarding form fields (phases 1–6) are **not persisted** — no phase save/submit API, `onboarding.currentStep/completedSteps` never advance, so Submissions shows dummy data. Phase 6 document uploads already persist through the private GridFS document API.
- Subsection submission status is not tracked independently; each phase's subheadings currently share its recorded submission status.
- Submissions client buttons **Notify Investment Manager** and **Edit** are placeholders (planned: email/in-app notification to the Investment Manager; Edit → open the phase form).
- Only `individual` onboarding exists; joint/corporate/trust show "coming soon".
- The generic row-details modal and Logs filters still use the old look (§9a). RM Notifications remains a recorded activity list. Compliance Officer Read/Unread state now persists per account; separate message generation, inbox delivery and push notifications are still absent.
- Scheduled emails need the external cron (§8) — without it they are only sent when someone loads the client list. Not deployed yet.
- `OnboardingStatusPage`: phase capsules use slate `#eceff7` / `#6d7692`; In progress uses green `#e3f8f2` / `#17b89b`. Awaiting-registry and Scheduled share blue.
- JSON file name typo `homaepagedata.json`. Current full-source lint has one existing warning (Profile hook dependency), zero errors.
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
