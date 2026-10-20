import DashboardHeaderSection from "./dashboardheadersection";
import DashboardMenuSection from "./dashboardmenusection";

export default function DashboardDetailsSection({ onLogout, user, config, activeMenu, setActiveMenu, mobileOpen, onOpenMobile, children }) {
  return (
    <div className="dashboard-details-section">
      <DashboardHeaderSection onLogout={onLogout} user={user} config={config} setActiveMenu={setActiveMenu} mobileOpen={mobileOpen} onOpenMobile={onOpenMobile} />
      <DashboardMenuSection activeMenu={activeMenu}>{children}</DashboardMenuSection>
    </div>
  );
}
