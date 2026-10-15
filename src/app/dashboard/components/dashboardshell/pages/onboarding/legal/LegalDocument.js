"use client";

// Renders the structured legal-document blocks used by the Phase 0 modal.

function Cell({ value }) {
  if (value && typeof value === "object") {
    return (
      <>
        {value.t}
        <span className="onb-legal-cellnote">{value.note}</span>
      </>
    );
  }
  return String(value)
    .split("\n")
    .map((line, i) => <p key={i}>{line}</p>);
}

function Table({ block }) {
  const { head, rows, total, align = [], kind } = block;
  return (
    <div className="onb-legal-tablewrap">
      <table className={`onb-legal-table${kind === "conflicts" ? " conflicts" : ""}`}>
        <thead>
          <tr>
            {head.map((label, i) => (
              <th key={i} style={{ textAlign: align[i] || "center" }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i} style={{ textAlign: align[i] || "left" }}>
                  <Cell value={cell} />
                </td>
              ))}
            </tr>
          ))}
          {total && (
            <tr className="onb-legal-total">
              {total.map((cell, i) => (
                <td key={i} style={{ textAlign: align[i] || "left" }}>
                  {cell}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function renderBlock(b, i) {
  switch (b.k) {
    case "title":
      return <h1 key={i} className="onb-legal-title">{b.text}</h1>;
    case "subtitle":
      return <p key={i} className="onb-legal-subtitle">{b.text}</p>;
    case "h":
      return <h3 key={i} className="onb-legal-h">{b.text}</h3>;
    case "sched":
      return (
        <div key={i} className="onb-legal-sched">
          <span className="onb-legal-sched-label">{b.label}</span>
          <h2 className="onb-legal-sched-title">{b.text}</h2>
        </div>
      );
    case "sh":
      return <h4 key={i} className="onb-legal-sh">{b.text}</h4>;
    case "c":
      return (
        <div key={i} className={`onb-legal-c lvl${b.lvl}`}>
          <span className="onb-legal-n">{b.n}</span>
          <span className="onb-legal-ct">{b.text}</span>
        </div>
      );
    case "p":
      return <p key={i} className={`onb-legal-p lvl${b.lvl || 0}`}>{b.text}</p>;
    case "ul":
      return (
        <ul key={i} className="onb-legal-ul">
          {b.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "contents":
      return (
        <ul key={i} className="onb-legal-contents">
          {b.items.map(([n, label]) => (
            <li key={`${n}-${label}`}>
              <span className="onb-legal-n">{n}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return <Table key={i} block={b} />;
    case "rule":
      return <hr key={i} className="onb-legal-rule" />;
    case "foot":
      return (
        <div key={i} className="onb-legal-foot">
          {b.lines.map((line, j) => (
            <p key={j}>{line}</p>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function LegalDocument({ blocks }) {
  return <article className="onb-legal">{blocks.map(renderBlock)}</article>;
}
