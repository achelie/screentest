type TimerRef<TTimer> = {
  current: TTimer | null;
};

type LeadingTrailingThrottleOptions<TTimer> = {
  intervalMs: number;
  now: () => number;
  setTimer: (callback: () => void, delay: number) => TTimer;
  clearTimer: (timer: TTimer) => void;
  timerRef: TimerRef<TTimer>;
};

export type LeadingTrailingThrottle<TValue> = {
  push: (value: TValue) => void;
  cancel: () => void;
};

export function createLeadingTrailingThrottle<TValue, TTimer>(
  publish: (value: TValue) => void,
  options: LeadingTrailingThrottleOptions<TTimer>,
): LeadingTrailingThrottle<TValue> {
  const { clearTimer, intervalMs, now, setTimer, timerRef } = options;
  let hasPendingValue = false;
  let pendingValue: TValue;
  let lastPublishedAt: number | null = null;

  const clearScheduledTimer = () => {
    if (timerRef.current === null) return;

    clearTimer(timerRef.current);
    timerRef.current = null;
  };

  const publishPendingValue = () => {
    if (!hasPendingValue) return;

    const value = pendingValue;
    hasPendingValue = false;
    lastPublishedAt = now();
    publish(value);
  };

  const push = (value: TValue) => {
    pendingValue = value;
    hasPendingValue = true;

    if (lastPublishedAt === null) {
      publishPendingValue();
      return;
    }

    const elapsed = now() - lastPublishedAt;
    if (elapsed >= intervalMs) {
      clearScheduledTimer();
      publishPendingValue();
      return;
    }

    if (timerRef.current !== null) return;

    timerRef.current = setTimer(() => {
      timerRef.current = null;
      publishPendingValue();
    }, Math.max(0, intervalMs - elapsed));
  };

  const cancel = () => {
    clearScheduledTimer();
    hasPendingValue = false;
    lastPublishedAt = null;
  };

  return { push, cancel };
}

type DelayedObjectUrlReleaserOptions<TTimer> = {
  delayMs: number;
  setTimer: (callback: () => void, delay: number) => TTimer;
  clearTimer: (timer: TTimer) => void;
  revoke: (url: string) => void;
};

export type DelayedObjectUrlReleaser = {
  releaseLater: (url: string) => void;
  dispose: () => void;
};

export function createDelayedObjectUrlReleaser<TTimer>(
  options: DelayedObjectUrlReleaserOptions<TTimer>,
): DelayedObjectUrlReleaser {
  const { clearTimer, delayMs, revoke, setTimer } = options;
  const pendingUrls = new Map<TTimer, string>();
  let disposed = false;

  const releaseLater = (url: string) => {
    if (disposed) {
      revoke(url);
      return;
    }

    let timer: TTimer;
    timer = setTimer(() => {
      pendingUrls.delete(timer);
      revoke(url);
    }, delayMs);
    pendingUrls.set(timer, url);
  };

  const dispose = () => {
    if (disposed) return;

    disposed = true;
    for (const [timer, url] of pendingUrls) {
      clearTimer(timer);
      revoke(url);
    }
    pendingUrls.clear();
  };

  return { releaseLater, dispose };
}
