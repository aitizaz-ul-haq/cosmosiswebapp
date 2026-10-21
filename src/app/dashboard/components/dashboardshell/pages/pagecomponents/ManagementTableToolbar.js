export default function ManagementTableToolbar({
  title = "Table",
  columns = [],
  filterableFields = [],
  filterField = "all",
  setFilterField,
  filterValue,
  setFilterValue,
  onAdd,
  addLabel,
  addLogTitle,
  searchPlaceholder,
  hideDefaultFilter = false,
  customFilters = null,
}) {
  const fields = filterableFields.filter(Boolean);
  const dateFilter = filterField.toLowerCase().includes("date");
  const placeholders = {
    Companies: "Search companies by name, contact, email, or phone...",
    Supervisors: "Search supervisors by name, email, company, or role...",
    Users: "Search users by name, email, company, or role...",
    Clients: columns.some((column) => column.accessorKey === "phone")
      ? "Search clients by name, phone, or assignment..."
      : "Search clients by name or assignment...",
    "Relationship Managers": "Search relationship managers by name, email, phone, or company...",
  };

  if (hideDefaultFilter && !customFilters && !onAdd) return null;

  return (
    <div className={`management-table-toolbar${hideDefaultFilter ? " has-custom-filters" : ""}`}>
      {!hideDefaultFilter && (
        <div className="management-table-filters">
          <div className="management-filter-select">
            <select aria-label={`Filter ${title.toLowerCase()} by field`} value={filterField} onChange={(event) => setFilterField(event.target.value)}>
              <option value="all">All Fields</option>
              {fields.map((field) => (
                <option key={field} value={field}>
                  {columns.find((column) => (column.accessorKey || column.id) === field)?.header || field}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </div>
          <div className="management-filter-search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></svg>
            <input
              type={dateFilter ? "date" : "search"}
              aria-label={`Search ${title.toLowerCase()}`}
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              placeholder={dateFilter ? "Select date" : searchPlaceholder || placeholders[title] || `Search ${title.toLowerCase()}...`}
            />
          </div>
        </div>
      )}
      {customFilters}
      {onAdd && (
        <button type="button" className="management-table-add" onClick={onAdd} data-log-title={addLogTitle || `${addLabel} button clicked`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}
