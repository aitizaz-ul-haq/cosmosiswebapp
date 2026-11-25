import DashboardPageLoading from "../pages/loading/DashboardPageLoading";
import { dashboardConfigs } from "../../../config";

export default function DashboardMenuSection({ activeMenu, userRole, children }) {
  const tableMenus = ["companies", "supervisors", "users", "clients", "rms", "teams", "registry", "scheduled", "approvals", "underreview", "onboardingstatus", "submissions", "documents", "reports", "logs", "demo users", "requesteddemonstration"];
  const managementPage = tableMenus.includes(activeMenu) || (userRole === "superadmin" && activeMenu === "notifications");
  const sharedPageBackground = managementPage || activeMenu === "help" || (userRole === "client" && activeMenu === "onboarding");
  const brandedPage = !managementPage && !["dashboard", "profile", "help", "onboarding", "notifications"].includes(activeMenu);
  const pageLabel = dashboardConfigs[userRole]?.sidebar.menu.find((menu) => menu.key === activeMenu)?.label || activeMenu || "dashboard";
  return (
    <DashboardPageLoading key={`${userRole}:${activeMenu}`} pageLabel={pageLabel}>
      <div className={`dashboard-menus-section${activeMenu === "dashboard" ? " dashboard-home-content" : ""}${brandedPage ? " dashboard-menus-bg" : ""}${sharedPageBackground ? " dashboard-management-content" : ""}`} id="dashboard-content" role="region" aria-label="Dashboard content">{children}</div>
    </DashboardPageLoading>
  );
}
