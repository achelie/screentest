"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { linearLightToSrgb8Bit } from "@/lib/color-calibration";
import { testStartEventName } from "@/lib/test-events";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const MODES = [
  "Black & White Levels",
  "Neutral Grayscale",
  "Gamma 2.2",
  "Color Separation",
] as const;

const SHADOW_LEVELS = [0, 1, 2, 3, 4, 5] as const;
const HIGHLIGHT_LEVELS = [95, 96, 97, 98, 99, 100] as const;
const GRAY_LEVELS = [10, 25, 50, 75, 90] as const;
const GAMMA_MIDPOINT = linearLightToSrgb8Bit(0.5);

function LevelPattern() {
  return (
    <div className={styles.calibrationLevelPattern}>
      <section className={styles.calibrationLevelField} data-tone="shadow">
        <p>Black level</p>
        <div className={styles.calibrationLevelSteps}>
          {SHADOW_LEVELS.map((level) => (
            <span
              key={level}
              style={{ backgroundColor: `rgb(${level * 2.55} ${level * 2.55} ${level * 2.55})` }}
            >
              {level}%
            </span>
          ))}
        </div>
        <small>Keep 1% barely visible without lifting 0%.</small>
      </section>
      <section className={styles.calibrationLevelField} data-tone="highlight">
        <p>White level</p>
        <div className={styles.calibrationLevelSteps}>
          {HIGHLIGHT_LEVELS.map((level) => (
            <span
              key={level}
              style={{ backgroundColor: `rgb(${level * 2.55} ${level * 2.55} ${level * 2.55})` }}
            >
              {level}%
            </span>
          ))}
        </div>
        <small>Keep 99% separate from 100% without dimming the whole image.</small>
      </section>
    </div>
  );
}

function GrayscalePattern() {
  const repeatedLevels = [...GRAY_LEVELS, ...GRAY_LEVELS.toReversed()];

  return (
    <div className={styles.calibrationGrayPattern}>
      {repeatedLevels.map((level, index) => (
        <div className={styles.calibrationGrayField} key={`${level}-${index}`}>
          <span
            style={{ backgroundColor: `rgb(${level}% ${level}% ${level}%)` }}
          />
          <b>{level}%</b>
        </div>
      ))}
      <p>Every patch should look neutral, not red, green, or blue.</p>
    </div>
  );
}

function drawDevicePixelChecker(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return;

  const tile = document.createElement("canvas");
  tile.width = 2;
  tile.height = 2;
  const tileContext = tile.getContext("2d", { alpha: false });
  if (!tileContext) return;

  tileContext.fillStyle = "#000";
  tileContext.fillRect(0, 0, 2, 2);
  tileContext.fillStyle = "#fff";
  tileContext.fillRect(1, 0, 1, 1);
  tileContext.fillRect(0, 1, 1, 1);

  const pattern = context.createPattern(tile, "repeat");
  if (!pattern) return;
  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);
}

function GammaPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;
    const draw = () => drawDevicePixelChecker(canvas);
    const scheduleDraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(scheduleDraw);

    observer.observe(canvas);
    window.addEventListener("resize", scheduleDraw);
    scheduleDraw();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleDraw);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.calibrationGammaPattern}>
      <div className={styles.calibrationGammaReference}>
        <canvas
          aria-label="One device pixel black and white checkerboard"
          ref={canvasRef}
        />
        <span
          style={{ backgroundColor: `rgb(${GAMMA_MIDPOINT} ${GAMMA_MIDPOINT} ${GAMMA_MIDPOINT})` }}
        />
      </div>
      <div className={styles.calibrationGammaLabels}>
        <b>50% black and white checker</b>
        <b>sRGB half-light gray, value {GAMMA_MIDPOINT}</b>
      </div>
      <p>
        Step back until the checker blends. Both halves should look close at
        100% browser zoom.
      </p>
    </div>
  );
}

const COLOR_ROWS = [
  { label: "Red", rgb: [255, 0, 0] },
  { label: "Green", rgb: [0, 255, 0] },
  { label: "Blue", rgb: [0, 0, 255] },
  { label: "Cyan", rgb: [0, 255, 255] },
  { label: "Magenta", rgb: [255, 0, 255] },
  { label: "Yellow", rgb: [255, 255, 0] },
] as const;

const NATURAL_COLORS = [
  { label: "Skin", value: "#b98268" },
  { label: "Sky", value: "#668fb5" },
  { label: "Leaf", value: "#637449" },
  { label: "Wood", value: "#8d694a" },
] as const;

function ColorSeparationPattern() {
  return (
    <div className={styles.calibrationColorPattern}>
      <div className={styles.calibrationChannelRows}>
        {COLOR_ROWS.map((row) => (
          <div className={styles.calibrationChannelRow} key={row.label}>
            <b>{row.label}</b>
            {[25, 50, 75, 100].map((strength) => (
              <span
                key={strength}
                style={{
                  backgroundColor: `rgb(${row.rgb.map((channel) => (channel * strength) / 100).join(" ")})`,
                }}
              >
                {strength}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.calibrationNaturalColors}>
        {NATURAL_COLORS.map((color) => (
          <span key={color.label} style={{ backgroundColor: color.value }}>
            {color.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MonitorColorCalibration() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mode = MODES[activeIndex];

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + MODES.length) % MODES.length);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % MODES.length);
  }, []);

  return (
    <FullscreenTest
      advanceOnSurfaceClick
      controls={
        <div
          aria-label="Monitor color calibration mode"
          className={styles.toolGroup}
          role="group"
        >
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
      }
      name="Monitor color calibration"
      onNext={showNext}
      onPrevious={showPrevious}
      startEventName={testStartEventName("monitor-color-calibration")}
      status={`${mode}, ${activeIndex + 1} of ${MODES.length}. SDR visual check.`}
      surfaceLabel={`Full-screen monitor calibration pattern: ${mode.toLowerCase()}`}
      toolbarLayout="docked"
    >
      {activeIndex === 0 ? <LevelPattern /> : null}
      {activeIndex === 1 ? <GrayscalePattern /> : null}
      {activeIndex === 2 ? <GammaPattern /> : null}
      {activeIndex === 3 ? <ColorSeparationPattern /> : null}
    </FullscreenTest>
  );
}
