"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  advanceLoopPosition,
  estimateSubmittedFps,
} from "@/lib/screen-tearing";
import { testStartEventName } from "@/lib/test-events";
import { getTestMessages } from "@/lib/test-messages";
import type { Locale } from "@/lib/i18n";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const MODES = ["Stripe Tracking", "Block Layers", "Checker Scroll"] as const;
const SPEEDS = [
  { label: "Slow", value: 240 },
  { label: "Medium", value: 520 },
  { label: "Fast", value: 960 },
] as const;

const TEARING_UI = {
  en: { modes: MODES, speeds: ["Slow", "Medium", "Fast"], name: "Screen tearing test", running: "running", paused: "paused", pause: "Pause", play: "Play", pattern: "Test pattern", speed: "Pattern speed", frames: "Browser frames about {fps} fps, not display Hz.", measuring: "Browser frames measuring, not display Hz.", surface: "{mode} screen tearing pattern moving at {speed} pixels per second", reduced: "Motion starts paused because your device requests reduced motion. Use Play only when you are ready for a fast moving pattern." },
  zh: { modes: ["条纹追踪", "分层方块", "滚动棋盘格"], speeds: ["慢速", "中速", "快速"], name: "屏幕撕裂测试", running: "运行中", paused: "已暂停", pause: "暂停", play: "播放", pattern: "测试图案", speed: "图案速度", frames: "浏览器帧率约 {fps} fps，不等于显示器 Hz。", measuring: "正在估算浏览器帧率，不等于显示器 Hz。", surface: "{mode} 屏幕撕裂图案，速度 {speed} 像素/秒", reduced: "设备启用了减少动态效果，因此图案默认暂停。准备好观察高速运动后再点播放。" },
  de: { modes: ["Streifenverfolgung", "Blockebenen", "Schachbrettlauf"], speeds: ["Langsam", "Mittel", "Schnell"], name: "Screen-Tearing-Test", running: "läuft", paused: "pausiert", pause: "Pause", play: "Start", pattern: "Testmuster", speed: "Mustergeschwindigkeit", frames: "Browser-Frames etwa {fps} fps, nicht Display-Hz.", measuring: "Browser-Frames werden gemessen, nicht Display-Hz.", surface: "{mode}-Muster für Screen Tearing mit {speed} Pixeln pro Sekunde", reduced: "Die Bewegung startet pausiert, weil das Gerät reduzierte Bewegung verlangt. Starte erst, wenn du für das schnelle Muster bereit bist." },
} as const;
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

export function ScreenTearingTest({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = TEARING_UI[locale];
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
    ? copy.frames.replace("{fps}", String(submittedFps))
    : copy.measuring;
  const modeLabel = copy.modes[activeIndex];

  return (
    <>
      <FullscreenTest
        messages={getTestMessages(locale).fullscreen}
        advanceOnSurfaceClick
        name={copy.name}
        onNext={showNext}
        onPrevious={showPrevious}
        startEventName={testStartEventName("screen-tearing-test")}
        status={`${modeLabel}，${running ? copy.running : copy.paused} · ${speed.value} px/s. ${frameStatus}`}
        surfaceLabel={copy.surface.replace("{mode}", modeLabel).replace("{speed}", String(speed.value))}
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
              {running ? copy.pause : copy.play}
            </button>
            <div aria-label={copy.pattern} className={styles.toolGroup} role="group">
              {MODES.map((item, index) => (
                <button
                  aria-pressed={index === activeIndex}
                  className={styles.toolButton}
                  data-selected={index === activeIndex}
                  key={item}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  {copy.modes[index]}
                </button>
              ))}
            </div>
            <div aria-label={copy.speed} className={styles.toolGroup} role="group">
              {SPEEDS.map((option, index) => (
                <button
                  aria-pressed={index === speedIndex}
                  className={styles.toolButton}
                  data-selected={index === speedIndex}
                  key={option.label}
                  onClick={() => setSpeedIndex(index)}
                  type="button"
                >
                  {copy.speeds[index]} · {option.value} px/s
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
          {copy.reduced}
        </p>
      ) : null}
    </>
  );
}
