import DashboardHeaderSection from "./dashboardheadersection";
import DashboardMenuSection from "./dashboardmenusection";

export default function DashboardDetailsSection({ onLogout, user, children }) {
  return (
    <div className="dashboard-details-section">
      {/* Header Section */}
      <DashboardHeaderSection onLogout={onLogout} user={user} />
      {/* Main Section */}
      <DashboardMenuSection children={children} />
    </div>
  );
}
