"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { linearLightToSrgb8Bit } from "@/lib/color-calibration";
import { testStartEventName } from "@/lib/test-events";
import { getTestMessages } from "@/lib/test-messages";
import type { Locale } from "@/lib/i18n";
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

const CALIBRATION_UI = {
  en: { modes: MODES, name: "Monitor color calibration", modeLabel: "Monitor color calibration mode", status: "{mode}, {current} of {total}. SDR visual check.", surface: "Full-screen monitor calibration pattern: {mode}", black: "Black level", blackHint: "Keep 1% barely visible without lifting 0%.", white: "White level", whiteHint: "Keep 99% separate from 100% without dimming the whole image.", neutral: "Every patch should look neutral, not red, green, or blue.", checkerAria: "One device pixel black and white checkerboard", checker: "50% black and white checker", halfGray: "sRGB half-light gray, value", gammaHint: "Step back until the checker blends. Both halves should look close at 100% browser zoom.", colors: ["Red", "Green", "Blue", "Cyan", "Magenta", "Yellow"], natural: ["Skin", "Sky", "Leaf", "Wood"] },
  zh: { modes: ["黑白电平", "中性灰阶", "Gamma 2.2", "色彩分离"], name: "显示器色彩校准", modeLabel: "显示器色彩校准模式", status: "{mode}，第 {current}/{total} 项，SDR 视觉检查。", surface: "全屏显示器校准图案：{mode}", black: "黑位", blackHint: "让 1% 刚好可见，同时保持 0% 纯黑。", white: "白位", whiteHint: "让 99% 与 100% 可区分，同时别把整幅画面压暗。", neutral: "每个色块都应保持中性，不应偏红、偏绿或偏蓝。", checkerAria: "单设备像素黑白棋盘格", checker: "50% 黑白棋盘格", halfGray: "sRGB 半光灰，数值", gammaHint: "向后退到棋盘格混合，两侧在浏览器 100% 缩放时应接近。", colors: ["红", "绿", "蓝", "青", "品红", "黄"], natural: ["肤色", "天空", "叶片", "木材"] },
  de: { modes: ["Schwarz- und Weißpegel", "Neutrale Graustufen", "Gamma 2,2", "Farbtrennung"], name: "Monitorkalibrierung", modeLabel: "Modus der Monitorkalibrierung", status: "{mode}, {current} von {total}. SDR-Sichtprüfung.", surface: "Kalibriermuster im Vollbild: {mode}", black: "Schwarzpegel", blackHint: "1 % soll gerade sichtbar bleiben, ohne 0 % anzuheben.", white: "Weißpegel", whiteHint: "99 % soll von 100 % getrennt bleiben, ohne das ganze Bild abzudunkeln.", neutral: "Jedes Feld soll neutral wirken, nicht rot, grün oder blau.", checkerAria: "Schwarz-weißes Schachbrett mit einem Gerätepixel", checker: "50 % Schwarz-Weiß-Schachbrett", halfGray: "sRGB-Grau bei halbem Licht, Wert", gammaHint: "Geh zurück, bis das Schachbrett verschmilzt. Bei 100 % Browserzoom sollten beide Hälften ähnlich wirken.", colors: ["Rot", "Grün", "Blau", "Cyan", "Magenta", "Gelb"], natural: ["Haut", "Himmel", "Blatt", "Holz"] },
} as const;

function LevelPattern({ locale }: { locale: Locale }) {
  const copy = CALIBRATION_UI[locale];
  return (
    <div className={styles.calibrationLevelPattern}>
      <section className={styles.calibrationLevelField} data-tone="shadow">
        <p>{copy.black}</p>
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
        <small>{copy.blackHint}</small>
      </section>
      <section className={styles.calibrationLevelField} data-tone="highlight">
        <p>{copy.white}</p>
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
        <small>{copy.whiteHint}</small>
      </section>
    </div>
  );
}

function GrayscalePattern({ locale }: { locale: Locale }) {
  const copy = CALIBRATION_UI[locale];
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
      <p>{copy.neutral}</p>
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

function GammaPattern({ locale }: { locale: Locale }) {
  const copy = CALIBRATION_UI[locale];
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
          aria-label={copy.checkerAria}
          ref={canvasRef}
        />
        <span
          style={{ backgroundColor: `rgb(${GAMMA_MIDPOINT} ${GAMMA_MIDPOINT} ${GAMMA_MIDPOINT})` }}
        />
      </div>
      <div className={styles.calibrationGammaLabels}>
        <b>{copy.checker}</b>
        <b>{copy.halfGray} {GAMMA_MIDPOINT}</b>
      </div>
      <p>
        {copy.gammaHint}
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

function ColorSeparationPattern({ locale }: { locale: Locale }) {
  const copy = CALIBRATION_UI[locale];
  return (
    <div className={styles.calibrationColorPattern}>
      <div className={styles.calibrationChannelRows}>
        {COLOR_ROWS.map((row) => (
          <div className={styles.calibrationChannelRow} key={row.label}>
            <b>{copy.colors[COLOR_ROWS.indexOf(row)]}</b>
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
            {copy.natural[NATURAL_COLORS.indexOf(color)]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MonitorColorCalibration({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = CALIBRATION_UI[locale];
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
      messages={getTestMessages(locale).fullscreen}
      advanceOnSurfaceClick
      controls={
        <div
          aria-label={copy.modeLabel}
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
              {copy.modes[index]}
            </button>
          ))}
        </div>
      }
      name={copy.name}
      onNext={showNext}
      onPrevious={showPrevious}
      startEventName={testStartEventName("monitor-color-calibration")}
      status={copy.status.replace("{mode}", copy.modes[activeIndex]).replace("{current}", String(activeIndex + 1)).replace("{total}", String(MODES.length))}
      surfaceLabel={copy.surface.replace("{mode}", copy.modes[activeIndex])}
      toolbarLayout="docked"
    >
      {activeIndex === 0 ? <LevelPattern locale={locale} /> : null}
      {activeIndex === 1 ? <GrayscalePattern locale={locale} /> : null}
      {activeIndex === 2 ? <GammaPattern locale={locale} /> : null}
      {activeIndex === 3 ? <ColorSeparationPattern locale={locale} /> : null}
    </FullscreenTest>
  );
}
