import assert from "node:assert/strict";
import test from "node:test";

import { getGuidedResult, GUIDED_STEP_IDS, type GuidedAnswers } from "./guided-result";

function allAnswers(answer: "normal" | "issue" | "skipped"): GuidedAnswers {
  return Object.fromEntries(GUIDED_STEP_IDS.map((step) => [step, answer]));
}

test("only six recorded normal checks produce a normal result", () => {
  assert.deepEqual(getGuidedResult(allAnswers("normal")), {
    status: "normal", normalCount: 6, issueCount: 0, skippedCount: 0,
    notCheckedCount: 0, uninspectedCount: 0,
  });
});

test("skipping one check leaves a zero-issue session incomplete", () => {
  const result = getGuidedResult({ ...allAnswers("normal"), motion: "skipped" });
  assert.equal(result.status, "incomplete");
  assert.equal(result.normalCount, 5);
  assert.equal(result.uninspectedCount, 1);
});

test("all skipped and all unanswered sessions are incomplete", () => {
  assert.deepEqual(getGuidedResult(allAnswers("skipped")), {
    status: "incomplete", normalCount: 0, issueCount: 0, skippedCount: 6,
    notCheckedCount: 0, uninspectedCount: 6,
  });
  assert.deepEqual(getGuidedResult({}), {
    status: "incomplete", normalCount: 0, issueCount: 0, skippedCount: 0,
    notCheckedCount: 6, uninspectedCount: 6,
  });
});

test("navigation past a check without answering cannot count it as normal", () => {
  const answers = allAnswers("normal");
  delete answers.black;
  const result = getGuidedResult(answers);
  assert.equal(result.status, "incomplete");
  assert.equal(result.notCheckedCount, 1);
  assert.equal(result.uninspectedCount, 1);
});

test("issues take priority while skipped and unanswered counts stay visible", () => {
  assert.deepEqual(getGuidedResult({ white: "issue", black: "normal", rgb: "issue", gray: "skipped" }), {
    status: "needs-review", normalCount: 1, issueCount: 2, skippedCount: 1,
    notCheckedCount: 2, uninspectedCount: 3,
  });
});

test("a recorded issue in a complete session still needs review", () => {
  const result = getGuidedResult({ ...allAnswers("normal"), white: "issue" });
  assert.equal(result.status, "needs-review");
  assert.equal(result.issueCount, 1);
  assert.equal(result.uninspectedCount, 0);
});
