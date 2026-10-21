import "./cosmosisloader.css";

export default function CosmosisLoader({ label = "Loading…", className = "" }) {
  return (
    <div
      className={`cosmosis-loader ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        className="cosmosis-loader-logo"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle className="cosmosis-loader-track" cx="60" cy="60" r="42" />
        <g className="cosmosis-loader-orbit">
          <circle
            className="cosmosis-loader-trail"
            cx="60"
            cy="60"
            r="42"
            pathLength="100"
          />
          <circle className="cosmosis-loader-primary" cx="18" cy="60" r="18" />
          <circle className="cosmosis-loader-satellite" cx="102" cy="60" r="8.5" />
        </g>
      </svg>
      <span className="cosmosis-loader-label" aria-hidden="true">Loading…</span>
      <span className="cosmosis-loader-announcement">{label}</span>
    </div>
  );
}
