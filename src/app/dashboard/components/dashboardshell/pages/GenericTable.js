"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import TableModal from "./pagecomponents/tablemodal";
import GenericTableLoader from "./pagecomponents/generictablecomps/generictableloader";
import GenericTableHeader from "./pagecomponents/generictablecomps/generictableheader";
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
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
              {actions.length > 0 && <th>Actions</th>} {/* ✅ Add header */}
            </tr>
          ))}
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                style={{ textAlign: "center" }}
              >
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="generic-table-actions">
                    {actions.map((act, idx) => (
                      <button
                        key={idx}
                        className={act.className}
                        onClick={() =>
                          act.type === "details"
                            ? setSelectedRow(row.original)
                            : act.onClick(row.original._id)
                        }
                      >
                        {act.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
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
