const tableSearch = "The field filter includes every data column displayed in the table. Choose All Fields to search across them, or choose one column and type in Search. Clear the search to restore the list. The page controls show up to 10 records at a time and move between matching results.";
const deleteConfirmation = "Delete opens a confirmation window naming the selected record. Enter your own account password and choose Delete. Cancel or Close leaves the record unchanged; controls wait while the request is being processed.";
const approvalDetails = "Full name, email, phone, status, onboarding type, assigned Investment Manager, shared Investment Managers, assigned by, Investment Manager remarks and creation date.";

// Describe the controls that exist today. Keep unavailable features explicit so Help
// does not imply that opening a page generates reports or saves sample submissions.
export const complianceHelpSections = [
  {
    key: "dashboard", title: "Dashboard", icon: "chart",
    description: "Understand company activity and open the work that needs attention.",
    functions: [
      { title: "Overview cards", action: "Read the four summary cards to monitor your company.", data: "Investment Manager count, active clients, completed onboardings and in-progress onboardings. Active clients exclude On hold and Cancelled. Monthly comparisons appear when the underlying dates are available." },
      { title: "Onboarding Progress by Client", action: "Use All Clients, In Progress, Completed or Under Review to filter the chart.", data: "Client names and onboarding progress across the six phases. An empty state appears when no clients match." },
      { title: "Pending Approvals and Quick Actions", action: "Review and View all open Pending Approvals. Quick Actions also open Under Review, Reports and Onboarding Status.", data: "The five most recent pending clients, company name and time since creation.", note: "Generate Report opens the Reports page; report generation is not available yet." },
      { title: "Recently Submitted Information", action: "Choose View submitted information to open the password-protected Submitted Information page.", data: "Up to five recent submission records with date and time, client name, company, assigned Investment Manager, stage and status." },
      { title: "Investment Manager Performance", action: "Choose This Month, Last Month or All Time to change the reporting period.", data: "Each manager’s name, assigned client total, clients in the selected period, completed onboardings and in-progress onboardings." },
      { title: "Header search, notifications and account menu", action: "Search dashboard pages by name in the top bar and select a result, or press Enter to open the first result. The bell opens the notification menu and its recent activity link opens Notifications. The account menu opens Settings or logs you out.", data: "Page names, your account name and designation, and a link to recorded recent client activity. The header search finds pages; use this Help page to search individual functions." },
      { title: "Light mode, dark mode and sidebar controls", action: "Use the sun and moon controls in the top bar to choose Light mode or Dark mode. Your choice is remembered in this browser. Collapse or expand the sidebar; on a phone, use the menu button to open it.", data: "The current appearance and the same sidebar destinations in either theme. Theme changes also apply to dialog windows." },
    ],
  },
  {
    key: "rms", title: "Investment Managers", icon: "briefcase",
    description: "Manage Investment Manager accounts within your company.",
    functions: [
      { title: "Browse, search and paginate Investment Managers", action: tableSearch, data: "Name, email, phone and company. Row actions are Email, Edit and Delete." },
      { title: "Add Investment Manager window", action: "Choose Add Investment Manager, complete the form and choose Save. Cancel or Close dismisses the form.", data: "Required username, full name, email, phone and password. The username is used to log in; the account is created as an Investment Manager in your company." },
      { title: "Edit Investment Manager window", action: "Choose Edit for the account, update its details and choose Save Changes. Leave New Password blank to keep the existing password.", data: "Username, full name, email, phone and optional new password. Password fields have a show/hide control." },
      { title: "Email an Investment Manager", action: "Choose Email to open your email application addressed to the manager. Compose and send the message there.", data: "The selected Investment Manager’s email address." },
      { title: "Delete Investment Manager confirmation", action: deleteConfirmation, data: "The selected Investment Manager’s name and your password confirmation." },
    ],
  },
  {
    key: "teams", title: "Teams", icon: "users",
    description: "Group Investment Managers under a leader and contact the group.",
    functions: [
      { title: "Browse, search and paginate Teams", action: tableSearch, data: "Team name, team leader and team members. Row actions are Email Team Leader, Edit, View and Delete. Retry reloads the list after a loading error." },
      { title: "Add Team window", action: "Choose Add Team. Enter a unique team name, select one Team Leader and at least one Team Member, then choose Add Team. Add Team Member creates another selector; Remove removes that member row. Cancel closes the form.", data: "Team name, one leader and a list of members selected from active Investment Managers in your company. A leader cannot also be a member, and members cannot be repeated. At least two active managers are needed." },
      { title: "Edit Team window", action: "Choose Edit to rename the team, reassign its leader, or add and remove members. Choose Save Changes to save.", data: "The current team name, leader and selected members. Unavailable assignments are shown for replacement or removal before saving." },
      { title: "View Team window", action: "Choose View to inspect the team. Close returns to the list. Send message to team opens a group email in your email application.", data: "Team name, member count, leader name and email, and each member’s name and email. Unavailable accounts or emails are identified." },
      { title: "Email Team Leader and Send message to team", action: "Email Team Leader addresses the leader only. Send message to team, inside View, addresses the leader and every member with duplicate email addresses removed. Send the message from your email application.", data: "The selected recipients and a subject containing the team name. The actions are disabled when required email addresses are unavailable; repair the relevant Investment Manager account first." },
      { title: "Delete Team confirmation", action: deleteConfirmation, data: "The selected team name and your password confirmation. Deleting a team removes its grouping record; the Investment Manager accounts remain." },
    ],
  },
  {
    key: "clients", title: "Clients", icon: "user",
    description: "Manage client accounts, assignments, access and onboarding details.",
    functions: [
      { title: "Browse, search and paginate Clients", action: tableSearch, data: "Name, status, progress, onboarding type, assigned Investment Manager, shared Investment Managers and assigned by. Hover over shortened names to see the full value. Phone and email are available in Info." },
      { title: "Add Client window", action: "Choose Add Client, complete the fields and choose Save. Select an assigned Investment Manager. Enable sharing and select additional managers when shared access is needed. Cancel or Close dismisses the form.", data: "Username, full name, email, phone, status, onboarding type (Individual, Joint, Corporate or Trust), assigned Investment Manager, password and sharing selections. Required fields are marked in the form." },
      { title: "Edit Client window", action: "Choose Edit, change the client’s account or access details and choose Save Changes. Leave New Password blank to retain the existing password. Use the sharing checkbox and manager selections to update access.", data: "Username, full name, email, phone, status, onboarding type, assigned Investment Manager, optional new password and shared Investment Managers." },
      { title: "Client Info window", action: "Choose Info for a client that is not scheduled. Scroll inside the window to read all sections. Email opens a message to the client; Close returns to Clients.", data: "Client Information: full name, username, email and phone. Company: company name. Onboarding & Progress: status, type and individual phase/progress. Assignment & Access: assigned to, assigned by and shared with. Additional Information: Investment Manager remarks and creation date." },
      { title: "Client Schedule Details window", action: "For a Scheduled client, Info opens Client Schedule Details. Read the schedule and choose Close to return.", data: "Overview status, onboarding type, Investment Manager, shared with and assigned by; Investment Manager remarks; scheduled date, time, time zone and location; your local time when different; and creation date.", note: "Compliance Officers have a read-only schedule view. Scheduled passwords, credential copy actions and Edit schedule belong to the Investment Manager view." },
      { title: "Email a Client", action: "Choose Email in the row or Client Info window to open your email application addressed to that client.", data: "The client’s stored email address." },
      { title: "Delete Client confirmation", action: deleteConfirmation, data: "The selected client’s name and your password confirmation." },
    ],
  },
  {
    key: "onboardingstatus", title: "Onboarding Status", icon: "chart",
    description: "Follow clients whose onboarding is In progress, On hold or Cancelled.",
    functions: [
      { title: "Search, status filters, phase filters and pagination", action: "Search client names, creation dates, remarks, statuses or phases. Combine the search with status and phase dropdown filters. Use page controls for up to 10 clients per page.", data: "Client name, date added, Investment Manager remarks, current status, individual onboarding phase and progress. Read more and Show less expand or shorten long remarks." },
      { title: "Details and Onboarding Timeline", action: "Choose Details or expand the client row. In Onboarding Timeline, inspect Prerequisites and Phases 1–6. Collapse closes the expanded panel.", data: "Phase names and subsection headings, submitted indicators, current phase and pending sections. Submitted colours use recorded completed phases or a submitted/approved application; individual subsection submission status is not tracked separately.", note: "The phase timeline is available for Individual onboarding. The other onboarding types show an availability message." },
      { title: "Client Details tab", action: "Expand a client and choose Client Details. Use the tab buttons or left/right arrow keys to switch tabs.", data: "Full name, email, phone, onboarding type, Investment Manager, shared with, company, assigned by, date added, status and current phase." },
      { title: "Remarks tab", action: "Choose Remarks to read the Investment Manager’s saved remarks. Read more and Show less control long text.", data: "The remarks text and whether a remarks entry is present." },
      { title: "Submitted Information and Notify Investment Manager actions", action: "In an expanded client, Submitted Information opens that section and its password prompt. Unlock it, then search for the client there.", data: "Company clients and phase submission summaries in the Submitted Information destination.", note: "Notify Investment Manager is currently disabled. Compliance Officers cannot change client status from this page; status controls are available in the Investment Manager view." },
    ],
  },
  {
    key: "approvals", title: "Pending Approvals", icon: "checkCircle",
    description: "Inspect new clients and approve them or move them into review.",
    functions: [
      { title: "Browse, search and paginate Pending Approvals", action: tableSearch, data: "Clients waiting for approval: full name, email, phone, status and onboarding type. Row actions are Details and Delete." },
      { title: "Pending Approval Details window", action: "Choose Details to open the client information window. Read the information cards and remarks. Close dismisses the window.", data: approvalDetails },
      { title: "Email and Verify inside Details", action: "Email opens a message addressed to the client. Verify opens the Nemesis website in a new browser tab.", data: "The client’s email address and the external Nemesis website.", note: "Verify opens the website; it does not automatically verify the client or update their status." },
      { title: "Review a pending client", action: "In Details, choose Review to move the client to Under Review. A successful update removes them from Pending Approvals and closes Details.", data: "The selected client’s existing information is retained with an Under review status." },
      { title: "Approve a pending client", action: "In Details, choose Approve to make the client ready for the Investment Manager to register. A successful update closes Details and removes the client from this list.", data: "The selected client moves to Awaiting registry. The Investment Manager completes registration immediately or schedules it." },
      { title: "Delete pending client confirmation", action: deleteConfirmation, data: "The pending client’s name and your password confirmation." },
    ],
  },
  {
    key: "underreview", title: "Under Review", icon: "search",
    description: "Review clients previously moved out of Pending Approvals.",
    functions: [
      { title: "Browse, search and paginate Under Review", action: tableSearch, data: "Clients with Under review status: full name, email, phone, status and onboarding type. Row actions are Details and Delete." },
      { title: "Under Review Details window", action: "Choose Details to read the client information and Investment Manager remarks. Close dismisses the window.", data: approvalDetails },
      { title: "Email and Verify inside review Details", action: "Email opens a message to the client. Verify opens the Nemesis website in a new tab; it does not change the client’s record.", data: "The client’s stored email address and the external Nemesis website." },
      { title: "Approve an Under Review client", action: "Choose Approve inside Details. After the update succeeds, the client leaves Under Review and Details closes.", data: "The client’s status becomes Awaiting registry so the Investment Manager can register or schedule onboarding." },
      { title: "Delete Under Review client confirmation", action: deleteConfirmation, data: "The client’s name and your password confirmation." },
    ],
  },
  {
    key: "reports", title: "Reports", icon: "file",
    description: "The reporting destination and its current availability.",
    functions: [
      { title: "Report list, search and filters", action: tableSearch, data: "The prepared columns are Report, Company, Type, Created Date and Status.", note: "Reports currently displays an empty list. Report generation, report downloads and report detail windows are not available yet. The Dashboard Generate Report shortcut opens this page." },
    ],
  },
  {
    key: "notifications", title: "Notifications", icon: "bell",
    description: "Read recorded client activity across your company.",
    functions: [
      { title: "Notification table and pagination", action: "Browse the notification table and use the standard page controls below it to move through up to 10 records per page.", data: "Title, Description, Date, Read or Unread status, and Open. Notifications describe recorded New client added, Application submitted and Onboarding completed events across your company." },
      { title: "Column search and Read or Unread filter", action: "Choose All Fields, Title, Description, Date or Status, then type in Search. All Fields also matches affected users and emails. Combine this with All notifications, Unread or Read in the read-status dropdown. Clear Search and choose All notifications to restore the full list.", data: "Matching recorded activity with its confirmed read status. Date searches match the date text displayed in the table. The table resets to the first matching page when filters change." },
      { title: "Open notification details and mark as read", action: "Choose Open to show a small details window. Opening saves Read status for your signed-in account; other users keep their own read status. Close, the X or Escape returns to the table. If saving fails, the notification stays Unread and the window offers Retry.", data: "Title, full Description, Date and Time, the affected User, their Email when available, the Recipient viewing it, and confirmed Status. Read status is remembered across visits.", note: "Notifications reflect recorded client activity; this page does not create or send new messages." },
    ],
  },
  {
    key: "submissions", title: "Submitted Information", icon: "file",
    description: "Unlock and inspect the phase information view for engaged clients.",
    functions: [
      { title: "Password window: Enter, unlock and Cancel", action: "Enter your own current account password and choose Enter to unlock Submitted Information. Use the eye control to show or hide the password. Cancel, Close or Escape returns to Dashboard. The prompt appears each time you reopen the section.", data: "Your password is checked for this unlock. An incorrect password or a failed request displays an error for retry." },
      { title: "Search clients and paginate submitted information", action: "Choose All Fields, Client, Status, Phase or Date created and search the list. Date created matches the displayed date text. Use the pagination controls to browse up to 10 matching clients at a time.", data: "Clients with In progress, On hold or Cancelled status; client username or name, date added, current phase and status. Non-individual types do not currently provide phase entries." },
      { title: "Expand phases and submission actions menu", action: "Choose the client name or the three-dot actions menu. Show submission phases expands the phase list; Hide submission phases collapses it. View latest phase opens the latest available phase directly.", data: "Phase number and name, Completed or In progress status, completion date/time when present, and completed subsection counts." },
      { title: "View phase information window", action: "Choose View next to a phase, or View latest phase from the actions menu. Read the sections inside the window and choose Close to return.", data: "Client name, phase number and name, subsection headings, and each subsection’s Status, Submitted on and Details fields.", note: "This phase information currently contains generated sample data for interface testing. It is not a saved copy of the client’s completed form, and the generated completion dates must not be treated as submission evidence. The window is read-only for Compliance Officers." },
    ],
  },
  {
    key: "documents", title: "Submitted Documents", icon: "file",
    description: "Review uploaded client documents and their storage usage.",
    functions: [
      { title: "Documents password window: Enter, unlock and Cancel", action: "Enter your own current account password and choose Enter to unlock Submitted Documents. The eye control shows or hides the password. Cancel, Close or Escape returns to Dashboard. Reopening Submitted Documents asks for your password again.", data: "Only after unlocking does the section load its document list. Incorrect passwords and request failures show an error for retry." },
      { title: "Browse, search and paginate document storage", action: tableSearch + " Retry reloads the list if document loading fails.", data: "Client Name, Documents Uploaded and Total Storage Used. Unknown file sizes are labelled unavailable; partial totals distinguish known storage from unavailable sizes. Review is disabled when a client has no documents." },
      { title: "Review Documents window", action: "Choose Review for a client. Select one document using its radio button, then choose View Doc to open Document Viewer. Close returns to the clients list. View Doc stays disabled until a document with an available link is selected.", data: "Client name, total document count and storage; each file’s name, size, upload date and availability. Missing dates, sizes or file links are identified." },
      { title: "Document Viewer: PDF, image and text previews", action: "View Doc opens a read-only preview. Stored PDF files, supported raster images and plain text can be previewed. Use Retry Preview when a PDF or text load fails, or use Open Document to open the available file in a new tab.", data: "Client name, document name, file type, file size, upload time and the file preview. Plain-text previews show up to 200,000 characters and identify shortened content; Open Document provides the full file.", note: "Some file types and external PDF links do not have an inline preview. A preview message explains when to use Open Document. Missing or invalid file links cannot be opened." },
      { title: "Back to Documents and Close viewer", action: "Back to Documents or the viewer’s Close control returns to Review Documents with the selection retained. Close in Review Documents returns to the client document table.", data: "The current client’s uploaded files and selected document. This section provides document review; it has no upload, edit or delete document action." },
    ],
  },
  {
    key: "profile", title: "Settings", icon: "settings",
    description: "Manage your personal details, company details and password.",
    functions: [
      { title: "Account summary and settings sections", action: "Read the four account cards across the top; on a narrow screen, scroll that row horizontally. Below them, choose Security, Appearance, Personal Information or Company Information to expand it. Opening a section closes the previous section; choose it again to collapse it.", data: "Account Status, Role, Company and Member Since, followed by the four settings sections. Personal Information shows username, full name, phone, company, role, email, account status and account creation date." },
      { title: "Personal Information and Edit Personal Information window", action: "Expand Personal Information to view your details. Choose the small Edit button beside its heading, update your details and choose Save Changes. Cancel or Close dismisses the window.", data: "Full name, email and phone can be edited. The window does not change your username, role or company assignment. Saving errors appear within the window." },
      { title: "Company Information and Edit Company Information window", action: "Expand Company Information to view your company. Choose its small Edit button to open Edit Company Information, then Save Changes to save or Cancel to dismiss. If company details are unavailable, the section explains this and editing is disabled.", data: "Company name, legal name, website, registration number, tax ID, status and available primary contact name/email. Editable fields are Company Name, Legal Name, Website, Registration Number and Tax ID." },
      { title: "Security: Change Password", action: "Expand Security, enter Current Password and New Password, then choose Change Password. Use the eye controls to show or hide each field. Read the success or error message before leaving the page.", data: "Your current and new passwords. Both are required; the new password must contain at least six characters and differ from the current password. The fields clear after a successful change." },
      { title: "Appearance: Light mode and Dark mode", action: "Expand Appearance and use the Dark mode toggle to switch between light and dark. The same preference is controlled by the sun and moon buttons in the top bar.", data: "Your appearance preference, remembered in this browser and applied throughout the dashboard and its dialogs." },
      { title: "Log Out", action: "Open the account menu and choose Log Out to end the session and return to the login page.", data: "The signed-in account. If logout fails, an error lets you retry." },
    ],
  },
  {
    key: "help", title: "Help", icon: "info",
    description: "Find dashboard functions, actions, window contents and current availability.",
    functions: [
      { title: "Search functions, actions, modals and data", action: "Type a section name, function, button, window or data field in Search Help. Matching functions appear under their sidebar section. Use Clear search to restore the complete guide.", data: "Documentation for every Compliance Officer sidebar section, including dialog windows (modals), their fields, actions and unavailable features. Search checks headings and descriptions; it does not search private client records." },
      { title: "Browse sidebar sections and open a page", action: "Use the section list to jump to its functions in this guide. Choose Open section on a section card to navigate to that dashboard page.", data: "Dashboard, Investment Managers, Teams, Clients, Onboarding Status, Pending Approvals, Under Review, Reports, Notifications, Submitted Information, Submitted Documents, Settings and Help. Opening a protected section still requires its password check." },
      { title: "Back to top", action: "After scrolling down, choose the circular Back to top button in the bottom-right corner to smoothly return to the Help heading. If your device requests reduced motion, the page returns immediately.", data: "The top of the Help page, including its search bar and section list. Keyboard focus returns to the Help heading." },
      { title: "Text magnifier", action: "Choose the circular magnifying-glass button above Back to top, then move over Help text to read it through a circular lens at twice its usual size. On a touch screen, touch and move over the text. Choose the button again, or press Escape, to turn the lens off.", data: "An enlarged view of the Help text beneath the pointer. The underlying page layout and search results stay in place, and the button is highlighted while the lens is enabled." },
    ],
  },
];
