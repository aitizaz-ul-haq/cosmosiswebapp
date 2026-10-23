import DashboardPageLoading from "../pages/loading/DashboardPageLoading";

export default function DashboardMenuSection({ activeMenu, userRole, children }) {
  const tableMenus = ["companies", "supervisors", "users", "clients", "rms", "registry", "scheduled", "approvals", "underreview", "onboardingstatus", "submissions", "reports", "logs", "demo users", "requesteddemonstration"];
  const managementPage = tableMenus.includes(activeMenu) || (userRole === "superadmin" && activeMenu === "notifications");
  const sharedPageBackground = managementPage || (userRole === "client" && activeMenu === "onboarding");
  const brandedPage = !managementPage && !["dashboard", "profile", "onboarding", "notifications"].includes(activeMenu);
  return (
    <DashboardPageLoading key={`${userRole}:${activeMenu}`} pageLabel={activeMenu || "dashboard"}>
      <div className={`dashboard-menus-section${activeMenu === "dashboard" ? " dashboard-home-content" : ""}${brandedPage ? " dashboard-menus-bg" : ""}${sharedPageBackground ? " dashboard-management-content" : ""}`} id="dashboard-content" role="region" aria-label="Dashboard content">{children}</div>
    </DashboardPageLoading>
  );
}
