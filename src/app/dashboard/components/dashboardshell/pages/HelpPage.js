"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./dashboard/DashboardUI";
import { complianceHelpSections } from "./complianceHelpContent";
import HelpMagnifier from "./HelpMagnifier";
import "./styles/managementtable.css";
import "./styles/help.css";

export default function HelpPage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const scroller = pageRef.current?.closest(".dashboard-menus-section");
    if (!scroller) return undefined;
    const updateButton = () => setShowBackToTop(scroller.scrollTop > 240);
    updateButton();
    scroller.addEventListener("scroll", updateButton, { passive: true });
    return () => scroller.removeEventListener("scroll", updateButton);
  }, []);

  useEffect(() => {
    if (!magnifierEnabled) return undefined;
    const disableOnEscape = (event) => {
      if (event.key === "Escape") setMagnifierEnabled(false);
    };
    document.addEventListener("keydown", disableOnEscape);
    return () => document.removeEventListener("keydown", disableOnEscape);
  }, [magnifierEnabled]);

  const backToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pageRef.current?.closest(".dashboard-menus-section")?.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    headingRef.current?.focus({ preventScroll: true });
  };
  const sections = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return complianceHelpSections;
    return complianceHelpSections.map((section) => {
      const functions = section.functions.filter((item) => {
        const text = [section.title, section.description, item.title, item.action, item.data, item.note].filter(Boolean).join(" ").toLocaleLowerCase();
        const searchableText = /window|viewer|confirmation/.test(text) ? `${text} modal dialog` : text;
        return terms.every((term) => searchableText.includes(term));
      });
      return { ...section, functions };
    }).filter((section) => section.functions.length);
  }, [query]);
  const functionCount = sections.reduce((count, section) => count + section.functions.length, 0);
  const clearSearch = () => { setQuery(""); searchRef.current?.focus(); };
  const jumpToSection = (event, sectionKey) => {
    event.preventDefault();
    const target = document.getElementById(`help-section-${sectionKey}`);
    target?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
  };

  return (
    <div ref={pageRef} className="management-table-page compliance-help-page">
      <header className="management-table-heading">
        <h1 ref={headingRef} tabIndex={-1}>Help</h1>
        <p>Explore every Compliance Officer section, its functions, actions and window contents.</p>
      </header>

      <div className="compliance-help-search-panel" role="search" aria-label="Help guide">
        <label htmlFor="compliance-help-search">Search Help</label>
        <div className="compliance-help-search-row">
          <div className="compliance-help-search-field">
            <Icon name="search" size={20} />
            <input ref={searchRef} id="compliance-help-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search functions, actions, modals or data…" aria-describedby="compliance-help-search-hint" aria-controls="compliance-help-results" />
          </div>
          {query && <button type="button" className="compliance-help-clear" onClick={clearSearch} data-log-title="Clear Help search"><Icon name="x" size={16} />Clear search</button>}
        </div>
        <p id="compliance-help-search-hint">Try “password”, “team members”, “document viewer” or “approve”.</p>
        <p className="compliance-help-result-count" role="status" aria-live="polite" aria-atomic="true">{functionCount} function{functionCount === 1 ? "" : "s"} in {sections.length} section{sections.length === 1 ? "" : "s"}{query.trim() ? ` matching “${query.trim()}”` : ""}.</p>
      </div>

      <div className="compliance-help-layout" id="compliance-help-results">
        <nav className="compliance-help-index" aria-label="Help sections">
          <h2>Sidebar sections</h2>
          <ol>
            {sections.map((section) => <li key={section.key}><a href={`#help-section-${section.key}`} onClick={(event) => jumpToSection(event, section.key)} data-log-title={`Help: jump to ${section.title}`}><Icon name={section.icon} size={18} /><span>{section.title}</span><span className="compliance-help-index-count" aria-label={`${section.functions.length} functions`}>{section.functions.length}</span></a></li>)}
          </ol>
          {!sections.length && <p>No matching sections.</p>}
        </nav>

        <div className="compliance-help-articles">
          {!sections.length && <div className="compliance-help-empty"><Icon name="search" size={28} /><h2>No functions found</h2><p>Try a section name, action or field such as “email”, “client details” or “file size”.</p><button type="button" className="compliance-help-clear" onClick={clearSearch} data-log-title="Reset Help search">Clear search</button></div>}
          {sections.map((section) => <section key={section.key} className="compliance-help-section" aria-labelledby={`help-section-${section.key}`}>
            <header className="compliance-help-section-header">
              <span className="compliance-help-section-icon"><Icon name={section.icon} size={22} /></span>
              <div className="compliance-help-section-title"><h2 id={`help-section-${section.key}`} tabIndex={-1}>{section.title}</h2><p>{section.description}</p></div>
              {onNavigate && section.key !== "help" && <button type="button" className="compliance-help-open" onClick={() => onNavigate(section.key)} aria-label={`Open ${section.title}`} data-log-title={`Help: open ${section.title}`}>Open section<Icon name="chevronRight" size={17} /></button>}
            </header>
            <div className="compliance-help-functions">
              {section.functions.map((item) => <article className="compliance-help-function" key={item.title}><h3>{item.title}</h3><p>{item.action}</p><p className="compliance-help-data"><strong>Data and fields: </strong>{item.data}</p>{item.note && <p className="compliance-help-note"><Icon name="info" size={17} /><span>{item.note}</span></p>}</article>)}
            </div>
          </section>)}
        </div>
      </div>
      <div className="compliance-help-floating-actions" role="group" aria-label="Help reading controls">
        <button
          type="button"
          className="compliance-help-magnifier"
          aria-label="Text magnifier"
          aria-pressed={magnifierEnabled}
          title={magnifierEnabled ? "Turn off text magnifier (Escape)" : "Turn on text magnifier"}
          onClick={() => setMagnifierEnabled((enabled) => !enabled)}
          data-log-title={magnifierEnabled ? "Help: Disable text magnifier" : "Help: Enable text magnifier"}
        >
          <Icon name="search" size={32} />
        </button>
        {showBackToTop && (
          <button type="button" className="compliance-help-back-to-top" onClick={backToTop} data-log-title="Help: Back to top" title="Back to top">
            <Icon name="chevronDown" size={22} />
            <span>Back to top</span>
          </button>
        )}
      </div>
      <HelpMagnifier enabled={magnifierEnabled} sourceRef={pageRef} contentVersion={query} />
    </div>
  );
}
