import assert from "node:assert/strict";
import test from "node:test";

import { getTouchResult } from "./touch-result";

test("a full mouse path is still a mouse preview", () => {
  assert.deepEqual(getTouchResult({ paintedCells: 384, totalCells: 384, largestMissedRegion: 0, inputMode: "mouse" }), {
    coverage: "covered", isFullyCovered: true, isMousePreview: true,
  });
});

test("a full touch path reports coverage", () => {
  assert.deepEqual(getTouchResult({ paintedCells: 384, totalCells: 384, largestMissedRegion: 0, inputMode: "touch" }), {
    coverage: "covered", isFullyCovered: true, isMousePreview: false,
  });
});

test("empty input and empty geometry never complete a pass", () => {
  for (const totalCells of [0, 384]) {
    assert.deepEqual(getTouchResult({ paintedCells: 0, totalCells, largestMissedRegion: totalCells, inputMode: "none" }), {
      coverage: "no-path", isFullyCovered: false, isMousePreview: false,
    });
  }
});

test("completion uses actual cells even when a percentage could round to 100", () => {
  const result = getTouchResult({ paintedCells: 2999, totalCells: 3000, largestMissedRegion: 1, inputMode: "touch" });
  assert.equal(result.isFullyCovered, false);
  assert.equal(result.coverage, "isolated-gaps");
});

test("large connected gaps and scattered gaps receive different follow-up guidance", () => {
  const summary = { paintedCells: 380, totalCells: 384, largestMissedRegion: 4, inputMode: "touch" } as const;
  assert.equal(getTouchResult(summary).coverage, "connected-gaps");
  assert.equal(getTouchResult({ ...summary, largestMissedRegion: 3 }).coverage, "isolated-gaps");
});
