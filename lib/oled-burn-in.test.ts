import assert from "node:assert/strict";
import test from "node:test";

import {
  advanceBurnInPosition,
  nextLoopIndex,
  OLED_BURN_IN_SAFETY_LIMIT_MS,
  remainingSafetyTime,
} from "./oled-burn-in";

test("nextLoopIndex wraps forward and backward", () => {
  assert.equal(nextLoopIndex(4, 5), 0);
  assert.equal(nextLoopIndex(0, 5, -1), 4);
  assert.equal(nextLoopIndex(1, 5, 2), 3);
});

test("nextLoopIndex falls back safely for invalid values", () => {
  assert.equal(nextLoopIndex(2, 0), 2);
  assert.equal(nextLoopIndex(2.5, 5), 2.5);
  assert.equal(nextLoopIndex(2, 5, Number.NaN), 2);
});

test("burn-in animation speed is independent of callback frequency", () => {
  const at60Hz = Array.from({ length: 60 }).reduce<number>(
    (position) => advanceBurnInPosition(position, 160, 1000 / 60, 1000),
    0,
  );
  const at120Hz = Array.from({ length: 120 }).reduce<number>(
    (position) => advanceBurnInPosition(position, 160, 1000 / 120, 1000),
    0,
  );

  assert.ok(Math.abs(at60Hz - 160) < 0.001);
  assert.ok(Math.abs(at120Hz - 160) < 0.001);
});

test("burn-in animation wraps and ignores abnormal frame gaps", () => {
  assert.equal(advanceBurnInPosition(990, 40, 500 / 2, 1000), 990);
  assert.equal(advanceBurnInPosition(990, 200, 100, 1000), 10);
  assert.equal(advanceBurnInPosition(20, 100, Number.NaN, 1000), 20);
});

test("remainingSafetyTime reaches zero at the five-minute boundary", () => {
  assert.equal(remainingSafetyTime(1000, 1000), OLED_BURN_IN_SAFETY_LIMIT_MS);
  assert.equal(
    remainingSafetyTime(1000, 1000 + OLED_BURN_IN_SAFETY_LIMIT_MS - 1000),
    1000,
  );
  assert.equal(
    remainingSafetyTime(1000, 1000 + OLED_BURN_IN_SAFETY_LIMIT_MS),
    0,
  );
  assert.equal(
    remainingSafetyTime(1000, 1000 + OLED_BURN_IN_SAFETY_LIMIT_MS + 1),
    0,
  );
});

test("remainingSafetyTime safely handles invalid timestamps and limits", () => {
  assert.equal(remainingSafetyTime(2000, 1000), OLED_BURN_IN_SAFETY_LIMIT_MS);
  assert.equal(remainingSafetyTime(Number.NaN, 1000), OLED_BURN_IN_SAFETY_LIMIT_MS);
  assert.equal(remainingSafetyTime(0, 1000, Number.NaN), 0);
});
