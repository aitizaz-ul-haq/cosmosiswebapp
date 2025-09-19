// src/app/dashboard/configs.js
export const dashboardConfigs = {
  superadmin: {
    header: { logoText: "Super Admin" },
    sidebar: {
      menu: [
        { key: "companies", label: "Manage Companies" },
        { key: "users", label: "Manage Supervisors" },
        { key: "settings", label: "Settings" },
      ],
    },
  },
  supervisor: {
    header: { logoText: "Supervisor" },
    sidebar: {
      menu: [
        { key: "rms", label: "Manage RMs" },
        { key: "reports", label: "Reports" },
      ],
    },
  },
  rm: {
    header: { logoText: "Relationship Manager" },
    sidebar: {
      menu: [
        { key: "clients", label: "Manage Clients" },
        { key: "tasks", label: "Tasks" },
      ],
    },
  },
  client: {
    header: { logoText: "Client" },
    sidebar: {
      menu: [
        { key: "profile", label: "Profile" },
        { key: "onboarding", label: "Onboarding" },
      ],
    },
  },
};
