"use client";

import {
  Check,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FullscreenTest } from "./FullscreenTest";
import { testStartEventName } from "@/lib/test-events";
import { MovingTarget } from "./MovingTarget";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import type { TestMessages } from "@/lib/test-messages";

type GuidedStepId = "white" | "black" | "rgb" | "gray" | "gradient" | "motion";
type GuidedAnswer = "normal" | "issue" | "skipped";

const GUIDED_STEP_IDS: readonly GuidedStepId[] = ["white", "black", "rgb", "gray", "gradient", "motion"];

export function GuidedScreenTest({ messages }: { messages: Pick<TestMessages, "fullscreen" | "guided"> }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<GuidedStepId, GuidedAnswer>>>(
    {},
  );
  const [showSummary, setShowSummary] = useState(false);
  const [motionRunning, setMotionRunning] = useState(false);
  const [resetFocusRequest, setResetFocusRequest] = useState(0);
  const summaryTitleRef = useRef<HTMLHeadingElement>(null);
  const testRegionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const stepId = GUIDED_STEP_IDS[currentIndex];
  const step = messages.guided.steps[currentIndex];
  const currentAnswer = answers[stepId];

  const issueCount = useMemo(
    () => Object.values(answers).filter((answer) => answer === "issue").length,
    [answers],
  );

  useEffect(() => {
    if (stepId !== "motion" || prefersReducedMotion) {
      setMotionRunning(false);
    }
  }, [prefersReducedMotion, stepId]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== "visible") {
        setMotionRunning(false);
      }
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    if (!showSummary) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      summaryTitleRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [showSummary]);

  useEffect(() => {
    if (showSummary || resetFocusRequest === 0) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      testRegionRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [resetFocusRequest, showSummary]);

  const goPrevious = useCallback(() => {
    setMotionRunning(false);
    setCurrentIndex((current) => Math.max(0, current - 1));
  }, []);

  const goNext = useCallback(() => {
    setMotionRunning(false);
    setCurrentIndex((current) => Math.min(GUIDED_STEP_IDS.length - 1, current + 1));
  }, []);

  const recordAnswer = (answer: GuidedAnswer) => {
    setAnswers((current) => ({ ...current, [stepId]: answer }));
    setMotionRunning(false);

    if (currentIndex === GUIDED_STEP_IDS.length - 1) {
      setShowSummary(true);
    } else {
      setCurrentIndex((current) => current + 1);
    }
  };

  const runAgain = () => {
    setAnswers({});
    setCurrentIndex(0);
    setMotionRunning(false);
    setShowSummary(false);
    setResetFocusRequest((current) => current + 1);
  };

  if (showSummary) {
    return (
      <section aria-labelledby="guided-result-title" className={styles.guidedSummary}>
        <h2 id="guided-result-title" ref={summaryTitleRef} tabIndex={-1}>
          {issueCount === 0
            ? messages.guided.summaryNone
            : issueCount === 1
              ? messages.guided.summaryOne
              : messages.guided.summaryMany.replace("{count}", String(issueCount))}
        </h2>
        <p>
          {messages.guided.summaryBody}
        </p>

        <div className={styles.summaryList}>
          {GUIDED_STEP_IDS.map((itemId, index) => {
            const answer = answers[itemId];
            const item = messages.guided.steps[index];
            return (
              <div className={styles.summaryRow} key={itemId}>
                <strong>{item.name}</strong>
                <span>{answer ? {
                  normal: messages.guided.looksNormal,
                  issue: messages.guided.noticed,
                  skipped: messages.guided.skipped,
                }[answer] : messages.guided.notChecked}</span>
              </div>
            );
          })}
        </div>

        <button className={styles.summaryAction} onClick={runAgain} type="button">
          <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
          {messages.guided.runAgain}
        </button>
      </section>
    );
  }

  return (
    <div ref={testRegionRef} tabIndex={-1}>
      <FullscreenTest
        messages={messages.fullscreen}
        name={messages.guided.name}
        onNext={currentIndex < GUIDED_STEP_IDS.length - 1 ? goNext : undefined}
        onPrevious={currentIndex > 0 ? goPrevious : undefined}
      status={messages.guided.status.replace("{name}", step.name).replace("{current}", String(currentIndex + 1)).replace("{total}", String(GUIDED_STEP_IDS.length))}
      surfaceLabel={step.surface}
      startEventName={testStartEventName("guided")}
        controls={
          <>
            <div className={styles.guidedPrompt}>
              <strong>{step.name}</strong>
              <span>{step.prompt}</span>
            </div>

            {stepId === "motion" ? (
              <button
                aria-pressed={motionRunning}
                className={styles.toolButton}
                data-selected={motionRunning}
                onClick={() => setMotionRunning((current) => !current)}
                type="button"
              >
                {motionRunning ? (
                  <Pause aria-hidden="true" size={17} strokeWidth={1.8} />
                ) : (
                  <Play aria-hidden="true" size={17} strokeWidth={1.8} />
                )}
                {motionRunning ? messages.guided.pause : messages.guided.start}
              </button>
            ) : null}

            <div aria-label={messages.guided.recordLabel} className={styles.guidedAnswers}>
              <button
                aria-pressed={currentAnswer === "normal"}
                className={styles.answerButton}
                data-selected={currentAnswer === "normal"}
                onClick={() => recordAnswer("normal")}
                type="button"
              >
                <Check aria-hidden="true" size={17} strokeWidth={1.8} />
                {messages.guided.looksNormal}
              </button>
              <button
                aria-pressed={currentAnswer === "issue"}
                className={styles.answerButton}
                data-answer="issue"
                data-selected={currentAnswer === "issue"}
                onClick={() => recordAnswer("issue")}
                type="button"
              >
                <TriangleAlert aria-hidden="true" size={17} strokeWidth={1.8} />
                {messages.guided.noticed}
              </button>
              <button
                aria-pressed={currentAnswer === "skipped"}
                className={styles.answerButton}
                data-selected={currentAnswer === "skipped"}
                onClick={() => recordAnswer("skipped")}
                type="button"
              >
                <SkipForward aria-hidden="true" size={17} strokeWidth={1.8} />
                {messages.guided.skip}
              </button>
            </div>
          </>
        }
      >
        {stepId === "white" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#ffffff" }} />
        ) : null}
        {stepId === "black" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#000000" }} />
        ) : null}
        {stepId === "rgb" ? (
          <div className={styles.rgbPattern}>
            <span />
            <span />
            <span />
          </div>
        ) : null}
        {stepId === "gray" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#808080" }} />
        ) : null}
        {stepId === "gradient" ? (
          <div
            className={styles.gradientPattern}
            style={{ backgroundImage: "linear-gradient(to right, #000000, #ffffff)" }}
          />
        ) : null}
        {stepId === "motion" ? (
          <MovingTarget running={motionRunning} speed={480} />
        ) : null}
      </FullscreenTest>

      {stepId === "motion" && prefersReducedMotion ? (
        <p className={styles.inlineNotice}>
          {messages.guided.reduced}
        </p>
      ) : null}
    </div>
  );
}
