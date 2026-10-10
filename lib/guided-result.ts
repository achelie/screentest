export const GUIDED_STEP_IDS = [
  "white", "black", "rgb", "gray", "gradient", "motion",
] as const;

export type GuidedStepId = (typeof GUIDED_STEP_IDS)[number];
export type GuidedAnswer = "normal" | "issue" | "skipped";
export type GuidedAnswers = Partial<Record<GuidedStepId, GuidedAnswer>>;

export function getGuidedResult(answers: GuidedAnswers) {
  let normalCount = 0;
  let issueCount = 0;
  let skippedCount = 0;
  let notCheckedCount = 0;

  for (const step of GUIDED_STEP_IDS) {
    switch (answers[step]) {
      case "normal": normalCount += 1; break;
      case "issue": issueCount += 1; break;
      case "skipped": skippedCount += 1; break;
      default: notCheckedCount += 1;
    }
  }

  const uninspectedCount = skippedCount + notCheckedCount;
  const status = issueCount > 0
    ? "needs-review"
    : uninspectedCount > 0
      ? "incomplete"
      : "normal";

  return { status, normalCount, issueCount, skippedCount, notCheckedCount, uninspectedCount } as const;
}
