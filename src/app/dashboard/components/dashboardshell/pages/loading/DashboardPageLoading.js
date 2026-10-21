"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import CosmosisLoader from "./CosmosisLoader";
import "./dashboardpageloading.css";

const DashboardLoadingContext = createContext(null);
const MINIMUM_LOADING_MS = 1200;

// Pages report their own readiness; background requests and audit logs do not block navigation.
export function useDashboardPageLoading(isLoading) {
  const context = useContext(DashboardLoadingContext);
  const sourceId = useId();

  useEffect(() => {
    context?.setSourceLoading(sourceId, Boolean(isLoading));
  }, [context, sourceId, isLoading]);

  useEffect(() => () => {
    context?.setSourceLoading(sourceId, false);
  }, [context, sourceId]);

  return context !== null;
}

// The keyed boundary gives each destination its own timer and pending data sources.
export default function DashboardPageLoading({ children, pageLabel = "page" }) {
  const [sources, setSources] = useState(() => new Set());
  const [minimumVisible, setMinimumVisible] = useState(true);
  const shownAt = useRef(null);
  const contentRef = useRef(null);
  const wasLoading = useRef(true);
  const previousFocus = useRef(null);

  const setSourceLoading = useCallback((sourceId, loading) => {
    if (loading && !wasLoading.current && contentRef.current?.contains(document.activeElement)) {
      previousFocus.current = document.activeElement;
    }
    setSources((previous) => {
      if (previous.has(sourceId) === loading) return previous;
      const next = new Set(previous);
      if (loading) next.add(sourceId);
      else next.delete(sourceId);
      return next;
    });
  }, []);

  const context = useMemo(() => ({ setSourceLoading }), [setSourceLoading]);
  const dataLoading = sources.size > 0;
  const loading = minimumVisible || dataLoading;

  useEffect(() => {
    if (!minimumVisible && !dataLoading) {
      shownAt.current = null;
      return;
    }
    if (shownAt.current === null) shownAt.current = Date.now();
    if (dataLoading) {
      if (!minimumVisible) setMinimumVisible(true);
      return;
    }

    const remaining = Math.max(0, MINIMUM_LOADING_MS - (Date.now() - shownAt.current));
    const timer = window.setTimeout(() => setMinimumVisible(false), remaining);
    return () => window.clearTimeout(timer);
  }, [dataLoading, minimumVisible]);

  useEffect(() => {
    // A password gate may mount while the page is inert; focus it once it is revealed.
    if (wasLoading.current && !loading) {
      const dialog = contentRef.current?.querySelector('[role="dialog"]');
      const field = dialog?.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
      const previous = previousFocus.current;
      const canRestore = previous?.isConnected && contentRef.current?.contains(previous) && (!dialog || dialog.contains(previous));
      (canRestore ? previous : field)?.focus({ preventScroll: true });
      previousFocus.current = null;
    }
    wasLoading.current = loading;
  }, [loading]);

  return (
    <DashboardLoadingContext.Provider value={context}>
      <div className="dashboard-content-stage" data-loading={loading}>
        <div
          ref={contentRef}
          className="dashboard-page-view"
          inert={loading ? "" : undefined}
          aria-hidden={loading ? true : undefined}
          aria-busy={loading}
        >
          {children}
        </div>
        {loading && (
          <div className="dashboard-page-loading-overlay" data-testid="dashboard-page-loader">
            <CosmosisLoader label={`Loading ${pageLabel}`} />
          </div>
        )}
      </div>
    </DashboardLoadingContext.Provider>
  );
}
