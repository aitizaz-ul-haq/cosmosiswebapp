export default function DashboardMenuSection({ activeMenu, children }) {
  const brandedPage = !["dashboard", "profile", "onboarding", "notifications"].includes(activeMenu);
  return <div className={`dashboard-menus-section${activeMenu === "dashboard" ? " dashboard-home-content" : ""}${brandedPage ? " dashboard-menus-bg" : ""}`} id="dashboard-content" role="region" aria-label="Dashboard content">{children}</div>;
}
