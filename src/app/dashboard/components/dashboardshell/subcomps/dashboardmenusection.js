export default function DashboardMenuSection({ activeMenu, children }) {
  // Show the branded background on every page except the profile page
  // (client onboarding provides its own background/logo treatment).
  const showBackground =
    activeMenu !== "profile" && activeMenu !== "onboarding";
  return (
    <div
      className={`dashboard-menus-section${
        showBackground ? " dashboard-menus-bg" : ""
      }`}
    >
      {children}
    </div>
  );
}
