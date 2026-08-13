"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  advanceLoopPosition,
  estimateSubmittedFps,
} from "@/lib/screen-tearing";
import { testStartEventName } from "@/lib/test-events";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const MODES = ["Stripe Tracking", "Block Layers", "Checker Scroll"] as const;
const SPEEDS = [
  { label: "Slow", value: 240 },
  { label: "Medium", value: 520 },
  { label: "Fast", value: 960 },
] as const;
const POSITION_CYCLE_PX = 4608;
const FPS_SAMPLE_COUNT = 45;
const FPS_REPORT_INTERVAL_MS = 600;

function TearingPattern({ mode }: { mode: (typeof MODES)[number] }) {
  if (mode === "Stripe Tracking") {
    return (
      <div className={`${styles.tearingStage} ${styles.tearingStripeStage}`}>
        <div className={styles.tearingStripePattern} data-motion-factor="1" />
        <span className={styles.tearingFocusLine} aria-hidden="true" />
      </div>
    );
  }

  if (mode === "Block Layers") {
    const factors = [1, -0.66, 1.35, -0.9] as const;
    return (
      <div className={`${styles.tearingStage} ${styles.tearingBlockStage}`}>
        {factors.map((factor, index) => (
          <div className={styles.tearingBlockTrack} key={factor}>
            <div
              className={styles.tearingBlockPattern}
              data-motion-factor={factor}
              data-track={index + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.tearingStage} ${styles.tearingCheckerStage}`}>
      <div className={styles.tearingCheckerPattern} data-motion-factor="1" />
      <span className={styles.tearingFocusLine} aria-hidden="true" />
    </div>
  );
}

export function ScreenTearingTest() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const samplesRef = useRef<number[]>([]);
  const lastReportRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [running, setRunning] = useState(false);
  const [submittedFps, setSubmittedFps] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const mode = MODES[activeIndex];
  const speed = SPEEDS[speedIndex];

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + MODES.length) % MODES.length);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % MODES.length);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) setRunning(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const startEvent = testStartEventName("screen-tearing-test");
    const startMotion = () => {
      if (!prefersReducedMotion) setRunning(true);
    };

    window.addEventListener(startEvent, startMotion);
    return () => window.removeEventListener(startEvent, startMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== "visible") setRunning(false);
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    lastTimeRef.current = null;
    samplesRef.current = [];
    lastReportRef.current = 0;
    setSubmittedFps(null);

    if (!running) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    const movingLayers = stageRef.current?.querySelectorAll<HTMLElement>(
      "[data-motion-factor]",
    );

    const animate = (time: number) => {
      const lastTime = lastTimeRef.current;

      if (movingLayers && lastTime !== null && document.visibilityState === "visible") {
        const elapsed = time - lastTime;
        positionRef.current = advanceLoopPosition(
          positionRef.current,
          speed.value,
          Math.min(elapsed, 50),
          POSITION_CYCLE_PX,
        );

        movingLayers.forEach((layer) => {
          const factor = Number(layer.dataset.motionFactor ?? 1);
          layer.style.backgroundPositionX = `${positionRef.current * factor}px`;
        });

        samplesRef.current.push(elapsed);
        if (samplesRef.current.length > FPS_SAMPLE_COUNT) {
          samplesRef.current.shift();
        }

        if (time - lastReportRef.current >= FPS_REPORT_INTERVAL_MS) {
          setSubmittedFps(estimateSubmittedFps(samplesRef.current));
          lastReportRef.current = time;
        }
      }

      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [activeIndex, running, speed.value]);

  const frameStatus = submittedFps
    ? `Browser frames about ${submittedFps} fps, not display Hz.`
    : "Browser frames measuring, not display Hz.";

  return (
    <>
      <FullscreenTest
        advanceOnSurfaceClick
        name="Screen tearing test"
        onNext={showNext}
        onPrevious={showPrevious}
        startEventName={testStartEventName("screen-tearing-test")}
        status={`${mode}, ${running ? "running" : "paused"} at ${speed.value} px/s. ${frameStatus}`}
        surfaceLabel={`${mode} screen tearing pattern moving at ${speed.value} pixels per second`}
        toolbarLayout="docked"
        controls={
          <>
            <button
              aria-pressed={running}
              className={styles.toolButton}
              data-selected={running}
              onClick={() => setRunning((current) => !current)}
              type="button"
            >
              {running ? (
                <Pause aria-hidden="true" size={17} strokeWidth={1.8} />
              ) : (
                <Play aria-hidden="true" size={17} strokeWidth={1.8} />
              )}
              {running ? "Pause" : "Play"}
            </button>
            <div aria-label="Test pattern" className={styles.toolGroup} role="group">
              {MODES.map((item, index) => (
                <button
                  aria-pressed={index === activeIndex}
                  className={styles.toolButton}
                  data-selected={index === activeIndex}
                  key={item}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <div aria-label="Pattern speed" className={styles.toolGroup} role="group">
              {SPEEDS.map((option, index) => (
                <button
                  aria-pressed={index === speedIndex}
                  className={styles.toolButton}
                  data-selected={index === speedIndex}
                  key={option.label}
                  onClick={() => setSpeedIndex(index)}
                  type="button"
                >
                  {option.label} · {option.value} px/s
                </button>
              ))}
            </div>
          </>
        }
      >
        <div className={styles.tearingPatternHost} ref={stageRef}>
          <TearingPattern mode={mode} />
        </div>
      </FullscreenTest>

      {prefersReducedMotion ? (
        <p className={styles.inlineNotice}>
          Motion starts paused because your device requests reduced motion. Use
          Play only when you are ready for a fast moving pattern.
        </p>
      ) : null}
    </>
  );
}
