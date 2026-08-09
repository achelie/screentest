export default function Loading() {
  return (
    <div className="page-shell loading-shell" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading screen test</span>
      <div className="loading-grid" aria-hidden="true">
        <div className="loading-copy">
          <span className="loading-line loading-line-short" />
          <span className="loading-line loading-line-title" />
          <span className="loading-line" />
          <span className="loading-line loading-line-medium" />
        </div>
        <div className="loading-panel">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
