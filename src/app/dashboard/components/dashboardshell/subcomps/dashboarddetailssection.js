import DashboardHeaderSection from "./dashboardheadersection";
import DashboardMenuSection from "./dashboardmenusection";

export default function DashboardDetailsSection({ onLogout, children }) {
  return (
    <div className="dashboard-details-section">
      {/* Header Section */}
      <DashboardHeaderSection onLogout={onLogout} />
      {/* Main Section */}
      <DashboardMenuSection children={children} />
    </div>
  );
}
