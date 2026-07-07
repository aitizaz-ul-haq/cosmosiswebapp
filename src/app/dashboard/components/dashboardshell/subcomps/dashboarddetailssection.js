import DashboardHeaderSection from "./dashboardheadersection";
import DashboardMenuSection from "./dashboardmenusection";

export default function DashboardDetailsSection({
  onLogout,
  config,
  activeMenu,
  setActiveMenu,
  children,
}) {
  return (
    <div className="dashboard-details-section">
      {/* Header Section */}
      <DashboardHeaderSection
        onLogout={onLogout}
        config={config}
        setActiveMenu={setActiveMenu}
      />
      {/* Main Section */}
      <DashboardMenuSection activeMenu={activeMenu} children={children} />
    </div>
  );
}
