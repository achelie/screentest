import assert from "node:assert/strict";
import test from "node:test";

import { advanceLoopPosition, estimateSubmittedFps } from "./screen-tearing";

test("advanceLoopPosition uses elapsed time instead of callback count", () => {
  const at60Hz = Array.from({ length: 60 }).reduce<number>(
    (position) => advanceLoopPosition(position, 480, 1000 / 60, 2000),
    0,
  );
  const at120Hz = Array.from({ length: 120 }).reduce<number>(
    (position) => advanceLoopPosition(position, 480, 1000 / 120, 2000),
    0,
  );

  assert.ok(Math.abs(at60Hz - 480) < 0.001);
  assert.ok(Math.abs(at120Hz - 480) < 0.001);
});

test("advanceLoopPosition wraps cleanly around the animation cycle", () => {
  assert.equal(advanceLoopPosition(950, 200, 500, 1000), 50);
  assert.equal(advanceLoopPosition(10, -40, 500, 1000), 990);
});

test("estimateSubmittedFps reports common 60Hz and 120Hz callback timing", () => {
  assert.equal(estimateSubmittedFps([16.6, 16.7, 16.8, 16.7]), 60);
  assert.equal(estimateSubmittedFps([8.2, 8.3, 8.4, 8.3]), 120);
});

test("estimateSubmittedFps ignores long interruptions and has a null fallback", () => {
  assert.equal(estimateSubmittedFps([16.6, 16.7, 850, 16.8]), 60);
  assert.equal(estimateSubmittedFps([]), null);
  assert.equal(estimateSubmittedFps([0, -4, 500]), null);
});
