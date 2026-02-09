"use client";

import { flexRender } from "@tanstack/react-table";

export default function GenericTableTbody({
  table,
  filteredData, // kept for compatibility, but not required
  columns,      // kept for compatibility (used for colSpan)
  actions = [],
  setSelectedRow,
}) {
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const totalCols = visibleColumnCount + (actions.length > 0 ? 1 : 0);

  return (
    <tbody>
      {rows.length === 0 ? (
        <tr>
          <td colSpan={totalCols} style={{ textAlign: "center" }}>
            No data found
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <tr
            key={row.id}
            onClick={() => setSelectedRow?.(row.original)}
            style={{ cursor: setSelectedRow ? "pointer" : "default" }}
          >
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
                    type="button"
                    className={act.className}
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent row click

                      if (act.type === "details") {
                        setSelectedRow?.(row.original);
                        return;
                      }

                      // Most of your actions use id; keep that behavior.
                      // If you later want full row, change to act.onClick(row.original)
                      act.onClick?.(row.original?._id);
                    }}
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
  );
}
