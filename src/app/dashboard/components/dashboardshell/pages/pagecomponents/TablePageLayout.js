"use client";

import { useDashboardPageLoading } from "../loading/DashboardPageLoading";
import "../styles/generictable.css";
import "../styles/managementtable.css";

export default function TablePageLayout({
  title = "Table",
  description,
  children,
  loading = false,
  className = "",
  panelClassName = "",
}) {
  useDashboardPageLoading(loading);

  return (
    <section className={`management-table-page ${className}`.trim()} data-table={title.toLowerCase()}>
      <header className="management-table-heading">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
      <div className={`generic-table-container management-table-panel ${panelClassName}`.trim()} aria-busy={loading}>
        {children}
      </div>
    </section>
  );
}
