// src/app/dashboard/configs.js
export const dashboardConfigs = {
  superadmin: {
    header: { logoText: "Super Admin" },
    sidebar: {
      menu: [
        { key: "dashboard", label: "Dashboard" },
        { key: "companies", label: "Companies" },
        { key: "supervisors", label: "Suprevisors" },
        { key: "users", label: "Users" },
        { key: "logs", label: "Logs" },
        { key: "reports", label: "Reports" },
        { key: "notifications", label: "Notifications" },
        { key: "system settings", label: "System Settings" },
        { key: "profile", label: "Profile" },
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
