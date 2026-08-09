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
import { MovingTarget } from "./MovingTarget";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type GuidedStepId = "white" | "black" | "rgb" | "gray" | "gradient" | "motion";
type GuidedAnswer = "normal" | "issue" | "skipped";

type GuidedStep = {
  readonly id: GuidedStepId;
  readonly name: string;
  readonly prompt: string;
  readonly surfaceLabel: string;
};

const GUIDED_STEPS: readonly GuidedStep[] = [
  {
    id: "white",
    name: "White",
    prompt: "Look for dark dots, dust, dim patches, and tinted edges.",
    surfaceLabel: "Full-screen pure white inspection pattern",
  },
  {
    id: "black",
    name: "Black",
    prompt: "In a dim room, look for bright edges and cloudy corners.",
    surfaceLabel: "Full-screen pure black inspection pattern",
  },
  {
    id: "rgb",
    name: "RGB",
    prompt: "Check whether any fixed dot refuses to match its color area.",
    surfaceLabel: "Full-screen red, green, and blue inspection pattern",
  },
  {
    id: "gray",
    name: "Gray",
    prompt: "Scan for cloudy patches, tint, and uneven brightness.",
    surfaceLabel: "Full-screen 50% gray uniformity pattern",
  },
  {
    id: "gradient",
    name: "Gradient",
    prompt: "A smooth ramp should not break into hard stripes or blocks.",
    surfaceLabel: "Full-screen neutral gradient banding pattern",
  },
  {
    id: "motion",
    name: "Motion",
    prompt: "Follow the target and watch for dark smears or bright halos.",
    surfaceLabel: "Moving high-contrast target at 480 pixels per second",
  },
];

const ANSWER_LABELS: Record<GuidedAnswer, string> = {
  normal: "Looks normal",
  issue: "Noticed something",
  skipped: "Skipped",
};

export function GuidedScreenTest() {
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
  const step = GUIDED_STEPS[currentIndex];
  const currentAnswer = answers[step.id];

  const issueCount = useMemo(
    () => Object.values(answers).filter((answer) => answer === "issue").length,
    [answers],
  );

  useEffect(() => {
    if (step.id !== "motion" || prefersReducedMotion) {
      setMotionRunning(false);
    }
  }, [prefersReducedMotion, step.id]);

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
    setCurrentIndex((current) => Math.min(GUIDED_STEPS.length - 1, current + 1));
  }, []);

  const recordAnswer = (answer: GuidedAnswer) => {
    setAnswers((current) => ({ ...current, [step.id]: answer }));
    setMotionRunning(false);

    if (currentIndex === GUIDED_STEPS.length - 1) {
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
            ? "Nothing obvious showed up."
            : `${issueCount} ${issueCount === 1 ? "check needs" : "checks need"} a closer look.`}
        </h2>
        <p>
          This summary stays in this tab. It is a visual check, not a hardware
          diagnosis, so confirm anything suspicious with the focused test.
        </p>

        <div className={styles.summaryList}>
          {GUIDED_STEPS.map((item) => {
            const answer = answers[item.id];
            return (
              <div className={styles.summaryRow} key={item.id}>
                <strong>{item.name}</strong>
                <span>{answer ? ANSWER_LABELS[answer] : "Not checked"}</span>
              </div>
            );
          })}
        </div>

        <button className={styles.summaryAction} onClick={runAgain} type="button">
          <RotateCcw aria-hidden="true" size={18} strokeWidth={1.8} />
          Run again
        </button>
      </section>
    );
  }

  return (
    <div ref={testRegionRef} tabIndex={-1}>
      <FullscreenTest
        name="Guided screen test"
        onNext={currentIndex < GUIDED_STEPS.length - 1 ? goNext : undefined}
        onPrevious={currentIndex > 0 ? goPrevious : undefined}
        status={`${step.name}, ${currentIndex + 1} of ${GUIDED_STEPS.length}.`}
        surfaceLabel={step.surfaceLabel}
        controls={
          <>
            <div className={styles.guidedPrompt}>
              <strong>{step.name}</strong>
              <span>{step.prompt}</span>
            </div>

            {step.id === "motion" ? (
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
                {motionRunning ? "Pause target" : "Start target"}
              </button>
            ) : null}

            <div aria-label="Record this check" className={styles.guidedAnswers}>
              <button
                aria-pressed={currentAnswer === "normal"}
                className={styles.answerButton}
                data-selected={currentAnswer === "normal"}
                onClick={() => recordAnswer("normal")}
                type="button"
              >
                <Check aria-hidden="true" size={17} strokeWidth={1.8} />
                Looks normal
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
                Noticed something
              </button>
              <button
                aria-pressed={currentAnswer === "skipped"}
                className={styles.answerButton}
                data-selected={currentAnswer === "skipped"}
                onClick={() => recordAnswer("skipped")}
                type="button"
              >
                <SkipForward aria-hidden="true" size={17} strokeWidth={1.8} />
                Skip
              </button>
            </div>
          </>
        }
      >
        {step.id === "white" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#ffffff" }} />
        ) : null}
        {step.id === "black" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#000000" }} />
        ) : null}
        {step.id === "rgb" ? (
          <div className={styles.rgbPattern}>
            <span />
            <span />
            <span />
          </div>
        ) : null}
        {step.id === "gray" ? (
          <div className={styles.solidPattern} style={{ backgroundColor: "#808080" }} />
        ) : null}
        {step.id === "gradient" ? (
          <div
            className={styles.gradientPattern}
            style={{ backgroundImage: "linear-gradient(to right, #000000, #ffffff)" }}
          />
        ) : null}
        {step.id === "motion" ? (
          <MovingTarget running={motionRunning} speed={480} />
        ) : null}
      </FullscreenTest>

      {step.id === "motion" && prefersReducedMotion ? (
        <p className={styles.inlineNotice}>
          Motion is paused because your device requests reduced motion. Start it
          only when you are ready for the moving pattern.
        </p>
      ) : null}
    </div>
  );
}
