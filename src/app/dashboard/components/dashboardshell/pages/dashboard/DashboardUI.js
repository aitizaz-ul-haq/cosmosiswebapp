"use client";

import { useId } from "react";
import ModalIcon from "../modalkit/Icon";
import { StatusPill } from "../modalkit/ModalKit";
import "./dashboard-ui.css";

const extraIcons = {
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  settings: <><path d="m10 2-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3z"/><circle cx="12" cy="12" r="3"/></>,
  search: <><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></>,
  zap: <path d="m13 2-9 12h7l-1 8L21 9h-8z"/>,
  pie: <><path d="M12 3v9h9A9 9 0 1 1 12 3Z"/><path d="M15 2v7h7a9 9 0 0 0-7-7Z"/></>,
  server: <><rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="10" width="18" height="5" rx="1"/><rect x="3" y="17" width="18" height="5" rx="1"/><path d="M6 5.5h.01M6 12.5h.01M6 19.5h.01M10 5.5h8M10 12.5h8M10 19.5h8"/></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="4"/><path d="M3 5v14c0 5 18 5 18 0V5M3 12c0 5 18 5 18 0"/></>,
  flag: <><path d="M4 22V3c6-4 10 5 17 0v11c-7 5-11-4-17 0"/></>,
  chevronRight: <path d="m9 5 7 7-7 7"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  menu: <path d="M3 5h18M3 12h18M3 19h18"/>,
  logout: <><path d="M9 3H4v18h5M9 12h13m-5-5 5 5-5 5"/></>,
};

const aliases = { lightning: "zap", document: "file", trend: "trendUp", progress: "trendUp", activity: "clock", reports: "file", team: "users", completed: "checkCircle", signature: "pen", upload: "file", chartBar: "chart", barChart: "chart", checkmark: "check", userRound: "user", chartPie: "pie", databaseIcon: "database" };

export function Icon({ name = "file", size = 22, className = "" }) {
  const key = aliases[name] || name;
  return extraIcons[key] ? <svg className={`dsh-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{extraIcons[key]}</svg> : <ModalIcon name={key} size={size} className={`dsh-icon ${className}`} />;
}

export function DashboardHero({ title, subtitle, tagline }) {
  return <header className="dsh-hero"><div className="dsh-hero-copy"><h1>{title}</h1><p>{subtitle}</p></div>{tagline && <p className="dsh-hero-tagline">{tagline}<span /></p>}</header>;
}

export function StatCard({ label, value, icon = "users", tone = "violet", trend, description, sparkline = true, children }) {
  const id = useId().replace(/:/g, "");
  const trendValue = typeof trend === "object" ? trend?.value : trend;
  const negative = Number.parseFloat(trendValue) < 0;
  return <article className={`dsh-stat dsh-stat--${tone}${sparkline ? " dsh-stat--sparkline" : ""}`}>
    {children ? <div className="dsh-stat-graphic">{children}</div> : <div className={`dsh-stat-icon dsh-tone--${tone}`}><Icon name={icon} size={29}/></div>}
    <div className="dsh-stat-copy"><h2>{label}</h2><strong className="dsh-stat-value">{value ?? "—"}</strong>{trendValue != null && <span className={`dsh-trend${negative ? " dsh-trend--negative" : ""}`}>{negative ? "▼" : "▲"} {typeof trendValue === "number" ? `${trendValue > 0 ? "+" : ""}${trendValue}%` : trendValue}</span>}<p className="dsh-stat-description">{description || (trendValue != null ? "vs last month" : "")}</p></div>
    {sparkline && <svg className="dsh-sparkline" viewBox="0 0 110 45" fill="none" aria-hidden="true"><defs><linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="currentColor" stopOpacity=".2"/><stop offset="1" stopColor="currentColor" stopOpacity=".03"/></linearGradient></defs><path d="M1 39C12 32 16 25 27 29S44 33 52 24 65 17 72 20 84 17 90 13 102 5 109 4V45H1Z" fill={`url(#spark-${id})`}/><path d="M1 39C12 32 16 25 27 29S44 33 52 24 65 17 72 20 84 17 90 13 102 5 109 4" stroke="currentColor" strokeWidth="1.5"/></svg>}
  </article>;
}

export function Panel({ title, icon = "chart", action, children, className = "" }) {
  return <section className={`dsh-panel ${className}`}><div className="dsh-panel-header"><Icon name={icon}/><h2>{title}</h2>{action && <div className="dsh-panel-action">{action}</div>}</div><div className="dsh-panel-body">{children}</div></section>;
}

export function Badge({ tone = "slate", status, children }) {
  return <StatusPill className="dsh-badge" tone={tone} status={status}>{children}</StatusPill>;
}

const SERIES = [
  { label: "Completed", color: "#27CDAE" },
  { label: "In Progress", color: "#8654FF" },
  { label: "Under Review", color: "#FFA249" },
  { label: "Not Started", color: "#B8BDC8" },
];

export function StackedBarChart({ bars = [], max, filter }) {
  const id = useId().replace(/:/g, "");
  const normalized = bars.map(bar => ({ ...bar, values: (bar.values || [0,0,0,0]).map(value => Math.max(0,Number(value) || 0)) }));
  const largest = Math.max(0,...normalized.map(bar=>bar.values.reduce((sum,v)=>sum+v,0)));
  const ceiling = Math.max(4,Math.ceil(Math.max(Number(max) || 0,largest) / 4) * 4);
  const ticks = Array.from({length:5},(_,i)=>ceiling * i / 4);
  const plot = { left: 33, top: 18, width: 460, height: 175 };
  const column = plot.width / Math.max(normalized.length,1);
  const barWidth = Math.min(58,column * .52);
  return <div className="dsh-chart">{filter && <div className="dsh-chart-filter">{filter}</div>}<svg className="dsh-chart-svg" viewBox="0 0 510 250" role="img" aria-label={normalized.length ? `Onboarding progress. ${normalized.map(bar => `${bar.label}: ${bar.values.map((v,i)=>`${v} ${SERIES[i].label}`).join(", ")}`).join(". ")}` : "No onboarding progress to display"}>
    <defs>{SERIES.map((series,i)=><linearGradient key={series.label} id={`bar-${id}-${i}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={series.color}/><stop offset="1" stopColor={series.color} stopOpacity=".88"/></linearGradient>)}</defs>
    {ticks.map(tick => {const y=plot.top+plot.height-(tick/ceiling)*plot.height;return <g key={tick}><line x1={plot.left} y1={y} x2={plot.left+plot.width} y2={y} stroke="#E9EDF7"/><text x={plot.left-10} y={y+4} textAnchor="end" fill="#7985B2" fontSize="12">{Number.isInteger(tick)?tick:tick.toFixed(1)}</text></g>;})}
    <line x1={plot.left} y1={plot.top} x2={plot.left} y2={plot.top+plot.height} stroke="#DFE5F2"/>
    {normalized.map((bar,index)=>{let used=0;const x=plot.left+column*index+(column-barWidth)/2;const labelLines=Array.isArray(bar.label)?bar.label:String(bar.label).split(/\n/);return <g key={`${bar.label}-${index}`}>{bar.values.map((v,i)=>{const height=v/ceiling*plot.height;used+=height;return <rect key={i} x={x} y={plot.top+plot.height-used} width={barWidth} height={height} fill={`url(#bar-${id}-${i})`} rx={i===3?2:0}><title>{`${SERIES[i].label}: ${v}`}</title></rect>;})}{labelLines.map((line,lineIndex)=><text key={lineIndex} x={x+barWidth/2} y={plot.top+plot.height+22+lineIndex*16} textAnchor="middle" fill="#23346A" fontSize={normalized.length>4?11:12}>{line}</text>)}{bar.sublabel && <text x={x+barWidth/2} y={plot.top+plot.height+40} textAnchor="middle" fill="#23346A" fontSize="12">{bar.sublabel}</text>}</g>;})}
    {!normalized.length && <text x="263" y="110" textAnchor="middle" fill="#7985B2" fontSize="13">No onboarding data yet</text>}
  </svg><div className="dsh-chart-legend">{SERIES.map(series=><span key={series.label}><i style={{backgroundColor:series.color}}/>{series.label}</span>)}</div></div>;
}

export function ActionList({ items = [] }) {
  return <div className="dsh-actions">{items.map((item,index)=><button key={item.title || index} className={`dsh-action dsh-tone--${item.tone || "violet"}`} onClick={item.onClick} type="button" data-log-title={item.title}><span className="dsh-action-icon"><Icon name={item.icon || "file"} size={27}/></span><span className="dsh-action-copy"><strong>{item.title}</strong><span>{item.description}</span></span><Icon name="chevronRight" size={17}/></button>)}</div>;
}

export function DonutProgress({ value = 0, size = 104 }) {
  const percent = Math.max(0,Math.min(100,Number(value) || 0));
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  return <div className="dsh-donut" style={{width:size,height:size}} role="img" aria-label={`${Math.round(percent)}% complete`}><svg viewBox="0 0 104 104" aria-hidden="true"><circle cx="52" cy="52" r={radius} fill="none" stroke="#E8E9F0" strokeWidth="12"/><circle cx="52" cy="52" r={radius} fill="none" stroke="#00C8B0" strokeWidth="12" strokeDasharray={`${percent/100*circumference} ${circumference}`} strokeLinecap="round" transform="rotate(-90 52 52)"/></svg><strong>{Math.round(percent)}%</strong></div>;
}

export function EmptyState({ children, message, icon = "file" }) {
  return <div className="dsh-empty"><span className="dsh-empty-icon"><Icon name={icon} size={28}/></span><p>{children || message || "No activity to display yet."}</p></div>;
}

export function ActivityTable({ columns = [], rows = [], emptyMessage = "No activity to display yet." }) {
  return <div className="dsh-table-scroll"><table className="dsh-table"><thead><tr>{columns.map(column=><th key={column.key} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row,index)=><tr key={row.id || row._id || index}>{columns.map(column=><td key={column.key}>{column.render ? column.render(row[column.key],row,index) : row[column.key] ?? "—"}</td>)}</tr>) : <tr><td colSpan={columns.length} className="dsh-table-empty">{emptyMessage}</td></tr>}</tbody></table></div>;
}

export function Avatar({ name = "", tone = "green" }) {
  const initials = String(name).trim().split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase() || "?";
  return <span className={`dsh-avatar dsh-tone--${tone}`} aria-hidden="true">{initials}</span>;
}
