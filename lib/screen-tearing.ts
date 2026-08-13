const MAX_FRAME_INTERVAL_MS = 100;

export function advanceLoopPosition(
  position: number,
  speed: number,
  elapsedMs: number,
  cycleLength: number,
) {
  if (
    !Number.isFinite(position) ||
    !Number.isFinite(speed) ||
    !Number.isFinite(elapsedMs) ||
    !Number.isFinite(cycleLength) ||
    elapsedMs < 0 ||
    cycleLength <= 0
  ) {
    return position;
  }

  const next = position + speed * (elapsedMs / 1000);
  return ((next % cycleLength) + cycleLength) % cycleLength;
}

export function estimateSubmittedFps(intervalsMs: readonly number[]) {
  const usable = [...intervalsMs]
    .filter(
      (interval) =>
        Number.isFinite(interval) &&
        interval > 0 &&
        interval <= MAX_FRAME_INTERVAL_MS,
    )
    .sort((left, right) => left - right);

  if (usable.length === 0) return null;

  const middle = Math.floor(usable.length / 2);
  const median =
    usable.length % 2 === 0
      ? (usable[middle - 1] + usable[middle]) / 2
      : usable[middle];

  return Math.round(1000 / median);
}
