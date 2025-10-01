"use client";

import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import TableModal from "./pagecomponents/tablemodal";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableHeader from "./pagecomponents/generictablecomps/generictableheader";
import GenericTableThead from "./pagecomponents/generictablecomps/generictablethead";
import GenericTableTbody from "./pagecomponents/generictablecomps/generictabletbody";
import "./styles/generictable.css";

export default function GenericTable({
  title = "Table",
  description = "",
  data = [],
  columns = [],
  filterableFields = [],
  actions = [],
  loading = false,
}) {
  const [filterField, setFilterField] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  // 🔍 Filter logic
  const filteredData = useMemo(() => {
    return data.filter((r) => {
      if (filterField === "all" || filterValue === "") return true;
      if (filterField.toLowerCase().includes("date")) {
        return new Date(r[filterField])
          .toLocaleDateString()
          .includes(filterValue);
      }
      return r[filterField]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  }, [data, filterField, filterValue]);

  // Table setup
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <GenericTableLoader />;
  }

  return (
    <div className="generic-table-container">
      {/* Header */}
      <GenericTableHeader
        title={title}
        description={description}
        filterField={filterField}
        setFilterField={setFilterField}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterableFields={filterableFields}
      />

      {/* Table */}
      <table className="generic-table">
        <GenericTableThead table={table} actions={actions} />
        <GenericTableTbody
          table={table}
          filteredData={filteredData}
          columns={columns}
          actions={actions}
          setSelectedRow={setSelectedRow}
        />
      </table>

      {/* Modal */}
      <TableModal
        data={selectedRow}
        onClose={() => setSelectedRow(null)}
        actions={actions.filter((a) => a.type !== "details")}
      />
    </div>
  );
}
