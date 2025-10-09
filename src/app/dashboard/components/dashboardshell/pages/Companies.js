"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/companies")
            .then((res) => res.json())
            .then((data) => setCompanies(data.companies || []))
            .finally(() => setLoading(false));
    }, []);

    // Dynamically generate columns from company object keys
    const columns = companies[0]
        ? Object.keys(companies[0]).map((key) => ({ accessorKey: key, header: key.charAt(0).toUpperCase() + key.slice(1) }))
        : [];

    return (
        <GenericTable
            title="Companies"
            description="All companies in the system. Search, filter, and manage companies here."
            data={companies}
            columns={columns}
            filterableFields={columns.map(col => col.accessorKey)}
            actions={[]}
            loading={loading}
        />
    );
}
