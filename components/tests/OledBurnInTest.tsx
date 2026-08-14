"use client";

import { Pause, Play, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  advanceBurnInPosition,
  nextLoopIndex,
  OLED_BURN_IN_SAFETY_LIMIT_MS,
  remainingSafetyTime,
} from "@/lib/oled-burn-in";
import { testStartEventName } from "@/lib/test-events";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const MODES = [
  "Solid Color Cycle",
  "Low Gray Uniformity",
  "Moving Color Bars",
  "Gradient Sweep",
] as const;

const SPEEDS = [
  { label: "Slow", intervalMs: 5000, motionPxPerSecond: 80 },
  { label: "Medium", intervalMs: 2500, motionPxPerSecond: 160 },
  { label: "Fast", intervalMs: 1250, motionPxPerSecond: 320 },
] as const;

const SOLID_COLORS = [
  { label: "50% Gray", value: "rgb(50% 50% 50%)" },
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#00ff00" },
  { label: "Blue", value: "#0000ff" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
] as const;

const LOW_GRAY_LEVELS = [5, 10, 20, 30, 50] as const;
const MOTION_CYCLE_PX = 3072;
const SAFETY_TICK_MS = 1000;

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("button, input, select, textarea, a, [contenteditable='true']"))
  );
}

function formatRemaining(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function BurnInPattern({
  modeIndex,
  solidIndex,
  grayIndex,
  safetyStopped,
}: {
  modeIndex: number;
  solidIndex: number;
  grayIndex: number;
  safetyStopped: boolean;
}) {
  if (safetyStopped) {
    return <div className={styles.burnInSafetyBlack} />;
  }

  if (modeIndex === 0) {
    return (
      <div
        className={styles.burnInSolidPattern}
        style={{ backgroundColor: SOLID_COLORS[solidIndex].value }}
      />
    );
  }

  if (modeIndex === 1) {
    const level = LOW_GRAY_LEVELS[grayIndex];
    return (
      <div
        className={styles.burnInSolidPattern}
        style={{ backgroundColor: `rgb(${level}% ${level}% ${level}%)` }}
      />
    );
  }

  if (modeIndex === 2) {
    return (
      <div
        className={styles.burnInColorBars}
        data-burn-in-motion
        data-motion-factor="1"
      />
    );
  }

  return (
    <div className={styles.burnInGradientPattern}>
      <div
        className={styles.burnInGrayGradient}
        data-burn-in-motion
        data-motion-factor="1"
      />
      <div
        className={styles.burnInColorGradient}
        data-burn-in-motion
        data-motion-factor="-0.72"
      />
    </div>
  );
}

export function OledBurnInTest() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const runStartedAtRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [solidIndex, setSolidIndex] = useState(0);
  const [grayIndex, setGrayIndex] = useState(1);
  const [running, setRunning] = useState(false);
  const [safetyStopped, setSafetyStopped] = useState(false);
  const [remainingMs, setRemainingMs] = useState(OLED_BURN_IN_SAFETY_LIMIT_MS);
  const prefersReducedMotion = usePrefersReducedMotion();
  const mode = MODES[activeIndex];
  const speed = SPEEDS[speedIndex];

  const pauseRun = useCallback(() => {
    runStartedAtRef.current = null;
    setRunning(false);
    setRemainingMs(OLED_BURN_IN_SAFETY_LIMIT_MS);
  }, []);

  const startRun = useCallback(() => {
    runStartedAtRef.current = performance.now();
    setSafetyStopped(false);
    setRemainingMs(OLED_BURN_IN_SAFETY_LIMIT_MS);
    setRunning(true);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => nextLoopIndex(current, MODES.length, -1));
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => nextLoopIndex(current, MODES.length));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) pauseRun();
  }, [pauseRun, prefersReducedMotion]);

  useEffect(() => {
    const startEvent = testStartEventName("oled-burn-in-test");
    const handleStart = () => {
      if (!prefersReducedMotion) startRun();
    };

    window.addEventListener(startEvent, handleStart);
    return () => window.removeEventListener(startEvent, handleStart);
  }, [prefersReducedMotion, startRun]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState !== "visible") pauseRun();
    };

    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [pauseRun]);

  useEffect(() => {
    if (!running) return;

    const updateSafetyTime = () => {
      const startedAt = runStartedAtRef.current;
      if (startedAt === null) return;

      const remaining = remainingSafetyTime(startedAt, performance.now());
      setRemainingMs(remaining);

      if (remaining === 0) {
        runStartedAtRef.current = null;
        setRunning(false);
        setSafetyStopped(true);
      }
    };

    updateSafetyTime();
    const timer = window.setInterval(updateSafetyTime, SAFETY_TICK_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running || activeIndex > 1) return;

    const timer = window.setInterval(() => {
      if (activeIndex === 0) {
        setSolidIndex((current) => nextLoopIndex(current, SOLID_COLORS.length));
      } else {
        setGrayIndex((current) => nextLoopIndex(current, LOW_GRAY_LEVELS.length));
      }
    }, speed.intervalMs);

    return () => window.clearInterval(timer);
  }, [activeIndex, running, speed.intervalMs]);

  useEffect(() => {
    lastTimeRef.current = null;

    if (!running || activeIndex < 2) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    const movingLayers = stageRef.current?.querySelectorAll<HTMLElement>(
      "[data-burn-in-motion]",
    );

    const animate = (time: number) => {
      const lastTime = lastTimeRef.current;

      if (movingLayers && lastTime !== null && document.visibilityState === "visible") {
        positionRef.current = advanceBurnInPosition(
          positionRef.current,
          speed.motionPxPerSecond,
          time - lastTime,
          MOTION_CYCLE_PX,
        );

        movingLayers.forEach((layer) => {
          const factor = Number(layer.dataset.motionFactor ?? 1);
          layer.style.backgroundPositionX = `${positionRef.current * factor}px`;
        });
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
  }, [activeIndex, running, speed.motionPxPerSecond]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInteractiveTarget(event.target)
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (running) pauseRun();
        else startRun();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSpeedIndex((current) => Math.min(SPEEDS.length - 1, current + 1));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSpeedIndex((current) => Math.max(0, current - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pauseRun, running, startRun]);

  const chooseManualSample = (type: "solid" | "gray", index: number) => {
    pauseRun();
    setSafetyStopped(false);
    if (type === "solid") setSolidIndex(index);
    else setGrayIndex(index);
  };

  const paceLabel =
    activeIndex < 2
      ? `${speed.intervalMs / 1000}s per screen`
      : `${speed.motionPxPerSecond} px/s`;
  const sampleLabel =
    activeIndex === 0
      ? SOLID_COLORS[solidIndex].label
      : activeIndex === 1
        ? `${LOW_GRAY_LEVELS[grayIndex]}% gray`
        : null;
  const runStatus = safetyStopped
    ? "Safety stop reached. Black screen shown."
    : running
      ? `running at ${paceLabel}; safety stop in ${formatRemaining(remainingMs)}`
      : `paused at ${paceLabel}`;

  return (
    <>
      <FullscreenTest
        additionalAriaKeyShortcuts="Space ArrowUp ArrowDown"
        additionalShortcutHelp="Use Space to pause or resume and the up and down arrow keys to change speed."
        advanceOnSurfaceClick
        controls={
          <>
            <button
              aria-pressed={running}
              className={styles.toolButton}
              data-selected={running}
              onClick={running ? pauseRun : startRun}
              type="button"
            >
              {running ? (
                <Pause aria-hidden="true" size={17} strokeWidth={1.8} />
              ) : safetyStopped ? (
                <ShieldCheck aria-hidden="true" size={17} strokeWidth={1.8} />
              ) : (
                <Play aria-hidden="true" size={17} strokeWidth={1.8} />
              )}
              {running
                ? "Pause"
                : safetyStopped
                  ? "Resume 5-minute test"
                  : "Play"}
            </button>
            <div aria-label="OLED burn-in test mode" className={styles.toolGroup} role="group">
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
            <div aria-label="OLED burn-in test speed" className={styles.toolGroup} role="group">
              {SPEEDS.map((option, index) => (
                <button
                  aria-pressed={index === speedIndex}
                  className={styles.toolButton}
                  data-selected={index === speedIndex}
                  key={option.label}
                  onClick={() => setSpeedIndex(index)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            {activeIndex === 0 ? (
              <label className={styles.selectWrap}>
                Color
                <select
                  className={styles.selectControl}
                  onChange={(event) => chooseManualSample("solid", Number(event.target.value))}
                  value={solidIndex}
                >
                  {SOLID_COLORS.map((color, index) => (
                    <option key={color.label} value={index}>{color.label}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {activeIndex === 1 ? (
              <label className={styles.selectWrap}>
                Gray level
                <select
                  className={styles.selectControl}
                  onChange={(event) => chooseManualSample("gray", Number(event.target.value))}
                  value={grayIndex}
                >
                  {LOW_GRAY_LEVELS.map((level, index) => (
                    <option key={level} value={index}>{level}%</option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        }
        keepControlsVisible={safetyStopped}
        name="OLED burn-in test"
        onNext={showNext}
        onPrevious={showPrevious}
        shortcutHint="F fullscreen, H hide, Space pause, ↑↓ speed"
        startEventName={testStartEventName("oled-burn-in-test")}
        status={`${mode}${sampleLabel ? `, ${sampleLabel}` : ""}; ${runStatus}`}
        surfaceLabel={`${mode} OLED burn-in and image retention test pattern`}
        toolbarLayout="docked"
      >
        <div className={styles.burnInPatternHost} ref={stageRef}>
          <BurnInPattern
            grayIndex={grayIndex}
            modeIndex={activeIndex}
            safetyStopped={safetyStopped}
            solidIndex={solidIndex}
          />
        </div>
      </FullscreenTest>

      {prefersReducedMotion ? (
        <p className={styles.inlineNotice}>
          Motion starts paused because your device requests reduced motion. Use
          Play only when you are ready for moving or changing patterns.
        </p>
      ) : null}
    </>
  );
}
