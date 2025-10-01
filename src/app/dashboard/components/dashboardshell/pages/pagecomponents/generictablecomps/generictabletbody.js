import { flexRender } from "@tanstack/react-table";

export default function GenericTableTbody({
  table,
  filteredData,
  columns,
  actions,
  setSelectedRow,
}) {
  return (
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
  );
}
