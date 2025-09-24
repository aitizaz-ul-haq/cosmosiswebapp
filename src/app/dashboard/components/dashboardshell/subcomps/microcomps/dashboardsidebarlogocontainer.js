import Image from "next/image";

export default function DashboardSidebarLogoContainer() {
  return (
    <div className="dashboard-sidebar-logo-container">
      <Image
        src="/images/sidebarlogo.png"
        width="209"
        height="108"
        alt="cosmosis logo"
        title="cosmosis logo"
      />
    </div>
  );
}
