import assert from "node:assert/strict";
import test from "node:test";

import {
  BLACK_LEVEL_MODES,
  DEPTH_COMPARE_LEVELS,
  DEPTH_PATCH_LEVELS,
  DEPTH_STRIPE_LEVEL,
  NEAR_BLACK_LEVELS,
  NEAR_BLACK_RAMP_END,
  stepBlackLevelMode,
} from "./black-level";

test("uses the exact near-black values required by the pattern", () => {
  assert.deepEqual(NEAR_BLACK_LEVELS, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(NEAR_BLACK_RAMP_END, 20);
});

test("uses stable embedded-pattern values", () => {
  assert.deepEqual(DEPTH_PATCH_LEVELS, [2, 4, 6, 8]);
  assert.deepEqual(DEPTH_COMPARE_LEVELS, [3, 5]);
  assert.equal(DEPTH_STRIPE_LEVEL, 3);
});

test("steps through modes and wraps in both directions", () => {
  assert.deepEqual(BLACK_LEVEL_MODES, ["pure", "levels", "depth"]);
  assert.equal(stepBlackLevelMode("pure", 1), "levels");
  assert.equal(stepBlackLevelMode("depth", 1), "pure");
  assert.equal(stepBlackLevelMode("pure", -1), "depth");
  assert.equal(stepBlackLevelMode("levels", -1), "pure");
});
