import Image from "next/image";

export default function DashboardSidebarMenuContainer({
  config,
  activeMenu,
  setActiveMenu,
  collapsed,
}) {
  return (
    <div className="dashboard-sidebar-menu-container">
      {config.sidebar.menu.map((item) => (
        <div
          className={`menu-options ${activeMenu === item.key ? "active" : ""}`}
          key={item.key}
          onClick={() => setActiveMenu(item.key)}
          data-log-title={`Menu: ${item.label}`}
          data-tooltip={item.label}
        >
          <Image
            src={item.iconlink}
            width="24"
            height="24"
            alt={item.label}
            title={item.label}
          />
          <span className="menu-options-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
