// src/app/dashboard/configs.js
export const dashboardConfigs = {
  superadmin: {
    header: { logoText: "Superadmin", searchPlaceholder: "Search companies, supervisors, users, reports..." },
    sidebar: {
      menu: [
        {
          key: "dashboard",
          label: "Dashboard",
          iconlink: "/images/dashboard.png",
        },
        // {
        //   key: "requesteddemonstration",
        //   label: "Demo Requests",
        //   iconlink: "/images/request.png",
        // },
        // {
        //   key: "demo users",
        //   label: "Demo Users",
        //   iconlink: "/images/demo.png",
        // },
        {
          key: "companies",
          label: "Companies",
          iconlink: "/images/building.png",
        },
        {
          key: "supervisors",
          label: "Supervisors",
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
          iconlink: "/images/bell-filled-white.svg",
        },
        // {
        //   key: "system settings",
        //   label: "System Settings",
        //   iconlink: "/images/settings.png",
        // },
        {
          key: "profile",
          label: "Profile",
          iconlink: "/images/profile-user.png",
        },
      ],
    },
  },
  supervisor: {
    header: { logoText: "Supervisor", searchPlaceholder: "Search clients, relationship managers, submissions, reports..." },
    sidebar: {
      menu: [
        {
          key: "dashboard",
          label: "Dashboard",
          iconlink: "/images/dashboard.png",
        },
        {
          key: "rms",
          label: "RMs",
          iconlink: "/images/Relationshipmanager.png",
        },
        {
          key: "clients",
          label: "Clients",
          iconlink: "/images/clients.png",
        },
        {
          key: "onboardingstatus",
          label: "Onboarding Status",
          iconlink: "/images/OnboardingStatus.png",
        },
        {
          key: "approvals",
          label: "Pending Approvals",
          iconlink: "/images/tick-filled-white.svg",
        },
        {
          key: "underreview",
          label: "Under Review",
          iconlink: "/images/under-review-white.svg",
        },
        {
          key: "reports",
          label: "Reports",
          iconlink: "/images/report.png",
        },
        {
          key: "submissions",
          label: "Submissions",
          iconlink: "/images/file.png",
        },
        {
          key: "profile",
          label: "Profile",
          iconlink: "/images/profile-user.png",
        },
      ],
    },
  },
  rm: {
    header: { logoText: "Relationship Manager", searchPlaceholder: "Search clients, onboarding, submissions, reports..." },
    sidebar: {
      menu: [
        {
          key: "dashboard",
          label: "Dashboard",
          iconlink: "/images/dashboard.png",
        },
        {
          key: "clients",
          label: "Clients",
          iconlink: "/images/clients.png",
        },
        {
          key: "registry",
          label: "Awaiting Registry",
          iconlink: "/images/file.png",
        },
        {
          key: "scheduled",
          label: "Scheduled",
          iconlink: "/images/file.png",
        },
        {
          key: "onboardingstatus",
          label: "Onboarding Status",
          iconlink: "/images/OnboardingStatus.png",
        },
        {
          key: "notifications",
          label: "Notifications",
          iconlink: "/images/bell-filled-white.svg",
        },
        {
          key: "submissions",
          label: "Submissions",
          iconlink: "/images/file.png",
        },
        {
          key: "profile",
          label: "Profile Settings",
          iconlink: "/images/profile-user.png",
        },
      ],
    },
  },
  client: {
    header: { logoText: "Client", searchPlaceholder: "Search onboarding tasks, documents, or help..." },
    sidebar: {
      menu: [
        {
          key: "dashboard",
          label: "Dashboard",
          iconlink: "/images/dashboard.png",
        },
        { 
          key: "onboarding", 
          label: "Onboarding",
          iconlink: "/images/building.png",
        },
        {
          key: "submissions",
          label: "Submissions",
          iconlink: "/images/file.png",
        },
        { 
          key: "profile", 
          label: "Profile",
          iconlink: "/images/profile-user.png",
        },
      ],
    },
  },
};
