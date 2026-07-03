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
  hideDefaultFilter = false,
}) {
  return (
    <div className="generic-table-header">
      <GenericTableHeaderTextContainer
        title={title}
        description={description}
      />
      {!hideDefaultFilter && (
        <GenericTableFilter
          filterField={filterField}
          setFilterField={setFilterField}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          filterableFields={filterableFields}
        />
      )}
    </div>
  );
}
