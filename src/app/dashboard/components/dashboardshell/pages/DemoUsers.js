"use client";

import { useEffect, useState } from "react";
import GenericTable from "./GenericTable";

export default function DemoUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch("/api/demo-users")
                .then((res) => res.json())
                .then((data) => setUsers(data.data || []))
                .finally(() => setLoading(false));
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const columns = [
        { accessorKey: "username", header: "Username" },
        { accessorKey: "passwordHash", header: "Password" },
        { accessorKey: "company", header: "Company" },
        { accessorKey: "firstname", header: "First Name" },
        { accessorKey: "lastname", header: "Last Name" },
        {
            accessorKey: "subscriptionStatus",
            header: "Subscription Status",
            cell: ({ getValue }) => {
                const status = getValue();
                let className = "status-badge";
                if (status === "demo") className += " status-demo";
                // Add more status styles as needed
                return <span className={className} style={{ background: status === "demo" ? "#FFD600" : undefined, color: "#333", borderRadius: "999px", padding: "0.25em 1em", display: "inline-block" }}>{status}</span>;
            },
        },
    ];

    return (
        <GenericTable
            title="Demo Users"
            description="All users currently in demo status. Manage and monitor demo users here."
            data={users}
            columns={columns}
            filterableFields={["username", "role", "companyId", "subscriptionStatus", "createdAt"]}
            actions={[]}
            loading={loading}
        />
    );
}