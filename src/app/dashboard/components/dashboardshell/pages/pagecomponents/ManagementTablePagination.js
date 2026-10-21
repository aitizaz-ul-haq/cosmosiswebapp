export default function ManagementTablePagination({ pagination, total, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));
  const pageIndex = Math.min(pagination.pageIndex, pageCount - 1);
  const firstRow = total === 0 ? 0 : pageIndex * pagination.pageSize + 1;
  const lastRow = Math.min(total, (pageIndex + 1) * pagination.pageSize);
  const visibleCount = Math.min(5, pageCount);
  const start = Math.max(0, Math.min(pageIndex - Math.floor(visibleCount / 2), pageCount - visibleCount));
  const pages = Array.from({ length: visibleCount }, (_, index) => start + index);

  return (
    <div className="generic-table-pagination">
      <div className="generic-table-pagination-info">
        Showing {firstRow}-{lastRow} of {total}
      </div>
      <nav className="generic-table-pagination-controls" aria-label="Table pagination">
        <button type="button" className="generic-table-page-btn" onClick={() => onPageChange(0)} disabled={pageIndex === 0}>
          First
        </button>
        <button type="button" className="generic-table-page-btn" onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0}>
          Prev
        </button>
        {pages.map((index) => (
          <button
            key={index}
            type="button"
            className={index === pageIndex ? "generic-table-page-btn active" : "generic-table-page-btn"}
            aria-label={`Page ${index + 1}`}
            aria-current={index === pageIndex ? "page" : undefined}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" className="generic-table-page-btn" onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex >= pageCount - 1}>
          Next
        </button>
        <button type="button" className="generic-table-page-btn" onClick={() => onPageChange(pageCount - 1)} disabled={pageIndex >= pageCount - 1}>
          Last
        </button>
      </nav>
      <div className="generic-table-pagination-status">
        Page {pageIndex + 1} of {pageCount}
      </div>
    </div>
  );
}
