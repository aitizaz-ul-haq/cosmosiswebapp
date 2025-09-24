import Image from "next/image";

export default function DashboardSidebarMenuContainer({
  config,
  activeMenu,
  setActiveMenu,
}) {
  return (
    <div className="dashboard-sidebar-menu-container">
      {config.sidebar.menu.map((item) => (
        <div
          className={`menu-options ${activeMenu === item.key ? "active" : ""}`}
          key={item.key}
          onClick={() => setActiveMenu(item.key)}
        >
          <Image
            src={item.iconlink}
            width="32"
            height="32"
            title={item.label}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
