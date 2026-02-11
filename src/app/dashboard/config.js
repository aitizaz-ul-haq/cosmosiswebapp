// src/app/dashboard/configs.js
export const dashboardConfigs = {
  superadmin: {
    header: { logoText: "Super Admin" },
    sidebar: {
      menu: [
        {
          key: "dashboard",
          label: "Dashboard",
          iconlink: "/images/dashboard.png",
        },
        {
          key: "requesteddemonstration",
          label: "Demo Requests",
          iconlink: "/images/request.png",
        },
        {
          key: "demo users",
          label: "Demo Users",
          iconlink: "/images/demo.png",
        },
        {
          key: "companies",
          label: "Companies",
          iconlink: "/images/building.png",
        },
        {
          key: "supervisors",
          label: "Suprevisors",
          iconlink: "/images/manager.png",
        },
        {
          key: "users",
          label: "Users",
          iconlink: "/images/multiple-users-silhouette.png",
        },
        { key: "logs", label: "Logs", iconlink: "/images/file.png" },
        { key: "reports", label: "Reports", iconlink: "/images/report.png" },
        {
          key: "notifications",
          label: "Notifications",
          iconlink: "/images/bell.png",
        },
        {
          key: "system settings",
          label: "System Settings",
          iconlink: "/images/settings.png",
        },
        {
          key: "profile",
          label: "Profile",
          iconlink: "/images/profile-user.png",
        },
      ],
    },
  },
  supervisor: {
    header: { logoText: "Supervisor" },
    sidebar: {
      menu: [
        {
          key: "rms",
          label: "RMs",
          iconlink: "/images/building.png",
        },
        {
          key: "clients",
          label: "Clients",
          iconlink: "/images/building.png",
        },
        {
          key: "onboarding",
          label: "Onboarding",
          iconlink: "/images/building.png",
        },
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
