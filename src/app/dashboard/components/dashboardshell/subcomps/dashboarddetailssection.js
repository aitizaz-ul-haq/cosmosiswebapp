import DashboardHeaderSection from "./dashboardheadersection";
import DashboardMenuSection from "./dashboardmenusection";

export default function DashboardDetailsSection({ onLogout, user, config, activeMenu, setActiveMenu, mobileOpen, onOpenMobile, theme, onToggleTheme, children }) {
  return (
    <div className="dashboard-details-section">
      <DashboardHeaderSection onLogout={onLogout} user={user} config={config} setActiveMenu={setActiveMenu} mobileOpen={mobileOpen} onOpenMobile={onOpenMobile} theme={theme} onToggleTheme={onToggleTheme} />
      <DashboardMenuSection activeMenu={activeMenu} userRole={user?.role}>{children}</DashboardMenuSection>
    </div>
  );
}
