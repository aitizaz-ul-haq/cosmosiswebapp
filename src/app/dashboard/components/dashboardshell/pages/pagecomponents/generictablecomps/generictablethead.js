import { flexRender } from "@tanstack/react-table";

export default function GenericTableThead({ table, actions }) {
  return (
    <thead>
      {table.getHeaderGroups().map((hg) => (
        <tr key={hg.id}>
          {hg.headers.map((header) => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
          {actions.length > 0 && <th>Actions</th>} {/* ✅ Add header */}
        </tr>
      ))}
    </thead>
  );
}
