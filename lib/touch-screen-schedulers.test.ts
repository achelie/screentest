import assert from "node:assert/strict";
import test from "node:test";

import {
  createDelayedObjectUrlReleaser,
  createLeadingTrailingThrottle,
} from "./touch-screen-schedulers";

type TimerCallback = () => void;

class FakeClock {
  now = 0;
  nextTimerId = 1;
  timers = new Map<number, { dueAt: number; callback: TimerCallback }>();
  clearedTimerIds: number[] = [];

  setTimer = (callback: TimerCallback, delay: number): number => {
    const timerId = this.nextTimerId;
    this.nextTimerId += 1;
    this.timers.set(timerId, {
      dueAt: this.now + delay,
      callback,
    });
    return timerId;
  };

  clearTimer = (timerId: number) => {
    this.clearedTimerIds.push(timerId);
    this.timers.delete(timerId);
  };

  advance(milliseconds: number) {
    const target = this.now + milliseconds;

    while (true) {
      const next = [...this.timers.entries()]
        .filter(([, timer]) => timer.dueAt <= target)
        .sort((left, right) => left[1].dueAt - right[1].dueAt)[0];
      if (!next) break;

      const [timerId, timer] = next;
      this.now = timer.dueAt;
      this.timers.delete(timerId);
      timer.callback();
    }

    this.now = target;
  }
}

test("leading/trailing throttle publishes the newest continuous value every 600ms", () => {
  const clock = new FakeClock();
  const timerRef = { current: null as number | null };
  const published: Array<{ at: number; value: string }> = [];
  const throttle = createLeadingTrailingThrottle<string, number>(
    (value: string) => published.push({ at: clock.now, value }),
    {
      intervalMs: 600,
      now: () => clock.now,
      setTimer: clock.setTimer,
      clearTimer: clock.clearTimer,
      timerRef,
    },
  );

  throttle.push("first");
  assert.deepEqual(published, [{ at: 0, value: "first" }]);

  clock.advance(100);
  throttle.push("second");
  const originalTimer = timerRef.current;
  clock.advance(200);
  throttle.push("newest-before-first-trailing-edge");
  assert.equal(timerRef.current, originalTimer, "continuous updates must not reset the timer");

  clock.advance(299);
  assert.equal(published.length, 1);
  clock.advance(1);
  assert.deepEqual(published.at(-1), {
    at: 600,
    value: "newest-before-first-trailing-edge",
  });
  assert.equal(timerRef.current, null);

  clock.advance(100);
  throttle.push("fourth");
  clock.advance(400);
  throttle.push("newest-before-second-trailing-edge");
  clock.advance(100);
  assert.deepEqual(published.at(-1), {
    at: 1200,
    value: "newest-before-second-trailing-edge",
  });
});

test("leading/trailing throttle publishes immediately after an idle interval", () => {
  const clock = new FakeClock();
  const published: Array<{ at: number; value: string }> = [];
  const throttle = createLeadingTrailingThrottle<string, number>(
    (value: string) => published.push({ at: clock.now, value }),
    {
      intervalMs: 600,
      now: () => clock.now,
      setTimer: clock.setTimer,
      clearTimer: clock.clearTimer,
      timerRef: { current: null },
    },
  );

  throttle.push("first");
  clock.advance(700);
  throttle.push("after-idle");

  assert.deepEqual(published, [
    { at: 0, value: "first" },
    { at: 700, value: "after-idle" },
  ]);
});

test("leading/trailing throttle cleanup cancels pending work and nulls its timer ref", () => {
  const clock = new FakeClock();
  const timerRef = { current: null as number | null };
  const published: string[] = [];
  const throttle = createLeadingTrailingThrottle<string, number>(
    (value: string) => published.push(value),
    {
      intervalMs: 600,
      now: () => clock.now,
      setTimer: clock.setTimer,
      clearTimer: clock.clearTimer,
      timerRef,
    },
  );

  throttle.push("leading");
  clock.advance(100);
  throttle.push("pending");
  assert.notEqual(timerRef.current, null);

  throttle.cancel();

  assert.equal(timerRef.current, null);
  assert.equal(clock.timers.size, 0);
  clock.advance(600);
  assert.deepEqual(published, ["leading"]);
});

test("leading/trailing throttle does not rebind an injected browser timer", () => {
  let now = 0;
  let scheduledCallback: TimerCallback | null = null;
  function browserTimer(this: unknown, callback: TimerCallback): number {
    assert.equal(this, undefined);
    scheduledCallback = callback;
    return 1;
  }
  const throttle = createLeadingTrailingThrottle<string, number>(() => {}, {
    intervalMs: 600,
    now: () => now,
    setTimer: browserTimer,
    clearTimer: () => {},
    timerRef: { current: null },
  });

  throttle.push("leading");
  now = 100;
  throttle.push("trailing");

  assert.notEqual(scheduledCallback, null);
});

test("delayed URL releaser waits before revoking a download URL", () => {
  const clock = new FakeClock();
  const revoked: string[] = [];
  const releaser = createDelayedObjectUrlReleaser<number>({
    delayMs: 1_000,
    setTimer: clock.setTimer,
    clearTimer: clock.clearTimer,
    revoke: (url: string) => revoked.push(url),
  });

  releaser.releaseLater("blob:download");
  assert.deepEqual(revoked, []);
  clock.advance(999);
  assert.deepEqual(revoked, []);
  clock.advance(1);
  assert.deepEqual(revoked, ["blob:download"]);
  assert.equal(clock.timers.size, 0);
});

test("delayed URL releaser dispose clears timers and revokes every pending URL", () => {
  const clock = new FakeClock();
  const revoked: string[] = [];
  const releaser = createDelayedObjectUrlReleaser<number>({
    delayMs: 1_000,
    setTimer: clock.setTimer,
    clearTimer: clock.clearTimer,
    revoke: (url: string) => revoked.push(url),
  });

  releaser.releaseLater("blob:first");
  releaser.releaseLater("blob:second");
  releaser.dispose();

  assert.deepEqual(revoked.sort(), ["blob:first", "blob:second"]);
  assert.equal(clock.timers.size, 0);
  assert.equal(clock.clearedTimerIds.length, 2);

  releaser.releaseLater("blob:after-dispose");
  assert.deepEqual(revoked.sort(), [
    "blob:after-dispose",
    "blob:first",
    "blob:second",
  ]);
  assert.equal(clock.timers.size, 0);
});

test("delayed URL releaser does not rebind injected browser functions", () => {
  const scheduledCallbacks: TimerCallback[] = [];
  const revoked: string[] = [];
  function browserTimer(this: unknown, callback: TimerCallback): number {
    assert.equal(this, undefined);
    scheduledCallbacks.push(callback);
    return 1;
  }
  function browserRevoke(this: unknown, url: string) {
    assert.equal(this, undefined);
    revoked.push(url);
  }
  const releaser = createDelayedObjectUrlReleaser<number>({
    delayMs: 1_000,
    setTimer: browserTimer,
    clearTimer: () => {},
    revoke: browserRevoke,
  });

  releaser.releaseLater("blob:browser");
  assert.equal(scheduledCallbacks.length, 1);
  scheduledCallbacks[0]!();

  assert.deepEqual(revoked, ["blob:browser"]);
});
