"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import "./styles/generictable.css"; // shared table styling

function TableModal({ data, onClose, actions }) {
  if (!data) return null;

  // Define keys to hide
  const hiddenKeys = ["_id", "__v", "updatedAt"];

  return (
    <div className="generic-table-modal">
      <div className="generic-table-modal-content">
        <button className="generic-table-modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Details</h3>
        {Object.keys(data)
          .filter((key) => !hiddenKeys.includes(key)) // 🚫 filter out unwanted keys
          .map((key) => (
            <p key={key}>
              <b>{key}:</b>{" "}
              {key.toLowerCase().includes("date")
                ? new Date(data[key]).toLocaleString()
                : data[key]?.toString()}
            </p>
          ))}
        {actions && actions.length > 0 && (
          <div className="generic-table-modal-actions">
            {actions.map((act, idx) => (
              <button
                key={idx}
                className={act.className}
                onClick={() => act.onClick(data._id)}
              >
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
    return (
      <div className="generic-table-loader">
        <div className="generic-table-spinner"></div>
        <p className="generic-table-loader-text">Loading…</p>
      </div>
    );
  }

  return (
    <div className="generic-table-container">
      {/* Header */}
      <div className="generic-table-header">
        <div>
          <h2 className="generic-table-heading">{title}</h2>
          {description && (
            <p className="generic-table-description">{description}</p>
          )}
        </div>
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
      </div>

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
