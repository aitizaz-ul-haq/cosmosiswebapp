export default function DashboardHeaderTextContainer({user}) {
  return (
    <div className="dashboard-header-text-conatiner">
      <h1 className="dashboard-header-heading">{user.username}</h1>
      <p>{user.role}</p>
    </div>
  );
}
