import DashboardShellIcon from "./dashboardshellicon";

export default function DashboardSidebarMenuContainer({ config, activeMenu, setActiveMenu, collapsed }) {
  return (
    <nav className="dashboard-sidebar-menu-container" aria-label="Dashboard navigation">
      {(config?.sidebar?.menu || []).map((item) => (
        <button type="button" className={`menu-options ${activeMenu === item.key ? "active" : ""}`} key={item.key} onClick={() => setActiveMenu?.(item.key)} data-log-title={`Menu: ${item.label}`} aria-current={activeMenu === item.key ? "page" : undefined} title={collapsed ? item.label : undefined}>
          <DashboardShellIcon name={item.key === "onboarding" ? "companies" : item.key} size={24} />
          <span className="menu-options-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
