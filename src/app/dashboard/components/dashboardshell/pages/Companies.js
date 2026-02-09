// "use client";

// import { useEffect, useMemo, useState } from "react";
// import GenericTable from "./GenericTable";

// export default function Companies() {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/companies", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setCompanies(data.companies || []))
//       .finally(() => setLoading(false));
//   }, []);

//   // ✅ Define ONLY the columns you want to show for Companies
//   const columns = useMemo(
//     () => [
//       { accessorKey: "name", header: "Name" },
//       { accessorKey: "tenantKey", header: "Tenant Key" },
//     ],
//     []
//   );

//   // ✅ Only allow filtering on these fields
//   const filterableFields = useMemo(
//     () => ["name", "tenantKey", "status", "primaryContact.email"],
//     []
//   );

//   const tableTitle ="Companies";
//   const tableDescription = "All companies in the system. Search, filter, and manage companies here.";

//   return (
//     <div>
//       <GenericTable
//         title={tableTitle}
//         description={tableDescription}
//         data={companies}
//         columns={columns}
//         filterableFields={filterableFields}
//         actions={[]}
//         loading={loading}
//       />
//     </div>
//   );
// }
