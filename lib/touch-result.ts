type TouchResultInput = Readonly<{
  paintedCells: number;
  totalCells: number;
  largestMissedRegion: number;
  inputMode: "none" | "mouse" | "touch" | "pen";
}>;

export function getTouchResult(summary: TouchResultInput) {
  const isFullyCovered = summary.totalCells > 0 && summary.paintedCells === summary.totalCells;
  const coverage = summary.paintedCells === 0
    ? "no-path"
    : isFullyCovered
      ? "covered"
      : summary.largestMissedRegion >= 4
        ? "connected-gaps"
        : "isolated-gaps";

  return {
    coverage,
    isFullyCovered,
    isMousePreview: summary.inputMode === "mouse",
  } as const;
}
