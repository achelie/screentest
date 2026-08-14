export const OLED_BURN_IN_SAFETY_LIMIT_MS = 5 * 60 * 1000;

const MAX_ANIMATION_INTERVAL_MS = 100;

export function nextLoopIndex(current: number, count: number, step = 1) {
  if (
    !Number.isInteger(current) ||
    !Number.isInteger(count) ||
    !Number.isInteger(step) ||
    count <= 0
  ) {
    return current;
  }

  return ((current + step) % count + count) % count;
}

export function advanceBurnInPosition(
  position: number,
  speedPxPerSecond: number,
  elapsedMs: number,
  cycleLengthPx: number,
) {
  if (
    !Number.isFinite(position) ||
    !Number.isFinite(speedPxPerSecond) ||
    !Number.isFinite(elapsedMs) ||
    !Number.isFinite(cycleLengthPx) ||
    elapsedMs < 0 ||
    elapsedMs > MAX_ANIMATION_INTERVAL_MS ||
    cycleLengthPx <= 0
  ) {
    return position;
  }

  const next = position + speedPxPerSecond * (elapsedMs / 1000);
  return ((next % cycleLengthPx) + cycleLengthPx) % cycleLengthPx;
}

export function remainingSafetyTime(
  startedAtMs: number,
  nowMs: number,
  limitMs = OLED_BURN_IN_SAFETY_LIMIT_MS,
) {
  if (
    !Number.isFinite(startedAtMs) ||
    !Number.isFinite(nowMs) ||
    !Number.isFinite(limitMs) ||
    limitMs <= 0 ||
    nowMs < startedAtMs
  ) {
    return Math.max(0, Number.isFinite(limitMs) ? limitMs : 0);
  }

  return Math.max(0, limitMs - (nowMs - startedAtMs));
}
