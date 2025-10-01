// components/pagecomponents/generictablecomps/generictablefilter.js
export default function GenericTableFilter({
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
  filterableFields,
}) {
  return (
    <div className="generic-table-filters">
      <select
        value={filterField}
        onChange={(e) => setFilterField(e.target.value)}
      >
        <option value="all">All Fields</option>
        {filterableFields.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <input
        type={filterField.toLowerCase().includes("date") ? "date" : "text"}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder={
          filterField.toLowerCase().includes("date")
            ? "Select date"
            : "Enter filter value"
        }
      />
    </div>
  );
}
