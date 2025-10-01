import GenericTableHeaderTextContainer from "./generictableheadertextcontainer";
import GenericTableFilter from "./generictablefilter";

export default function GenericTableHeader({
  title,
  description,
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
  filterableFields,
}) {
  return (
    <div className="generic-table-header">
      <GenericTableHeaderTextContainer
        title={title}
        description={description}
      />
      <GenericTableFilter
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterableFields={filterableFields}
      />
    </div>
  );
}
