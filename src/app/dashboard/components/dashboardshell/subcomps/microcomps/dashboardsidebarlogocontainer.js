import Image from "next/image";
import DashboardAccountMenu from "./dashboardaccountmenu";

export default function DashboardSidebarLogoContainer({ user, collapsed, onLogout, setActiveMenu }) {
  return (
    <div className="dashboard-sidebar-logo-container">
      <a href="/dashboard" className="dashboard-sidebar-brand" data-log-title="Cosmosis dashboard" aria-label="Cosmosis dashboard">
        <Image src="/images/cosmosis_logo_dark_dashboard.png" width={157} height={83} alt="Cosmosis" priority />
      </a>
      <DashboardAccountMenu user={user} onLogout={onLogout} setActiveMenu={setActiveMenu} sidebar collapsed={collapsed} />
    </div>
  );
}
