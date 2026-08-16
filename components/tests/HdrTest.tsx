"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createHdrCapabilityReport,
  type HdrCapabilityReport,
} from "@/lib/hdr-test";
import { testStartEventName } from "@/lib/test-events";
import { getTestMessages } from "@/lib/test-messages";
import type { Locale } from "@/lib/i18n";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const MODES = ["Detection", "Dynamic range", "Wide gamut"] as const;

const HDR_UI = {
  en: {
    modes: MODES, name: "HDR test", status: "{mode}, {current} of {total}.", surface: "Full-screen HDR test: {mode}", modeLabel: "HDR test mode",
    report: "Browser and output report", hdr: "HDR capable", sdr: "SDR reported", unavailable: "Query unavailable", checking: "Checking browser report",
    fields: ["Dynamic range", "Color gamut", "Color buffer", "Screen size", "Scale"],
    limitation: "Capability signals do not measure peak brightness, contrast, certification, or native panel bit depth.",
    black: "Pure black", white: "Reference white and highlight separation", colors: ["Red", "Green", "Orange"],
    gamutNote: "Equal-looking columns do not prove a narrow-gamut panel. The browser, operating system, profile, and display can map both colors.",
    high: "High dynamic range reported", standard: "Standard dynamic range reported", gamutUnavailable: "Color gamut query unavailable", depthUnavailable: "Not reported", depthSuffix: "-bit browser color buffer",
  },
  zh: {
    modes: ["环境检测", "动态范围", "广色域"], name: "HDR 测试", status: "{mode}，第 {current}/{total} 项。", surface: "全屏 HDR 测试：{mode}", modeLabel: "HDR 测试模式",
    report: "浏览器与输出环境", hdr: "检测到 HDR", sdr: "当前报告为 SDR", unavailable: "浏览器无法查询", checking: "正在读取浏览器报告",
    fields: ["动态范围", "色域", "颜色缓冲", "屏幕尺寸", "缩放比例"],
    limitation: "这些能力信号不能测量峰值亮度、对比度、认证或面板原生位深。",
    black: "纯黑", white: "参考白与高光分离", colors: ["红色", "绿色", "橙色"],
    gamutNote: "三列看起来相同不等于面板只有窄色域。浏览器、系统、配置文件和显示器都可能重新映射颜色。",
    high: "报告为高动态范围", standard: "报告为标准动态范围", gamutUnavailable: "无法查询色域", depthUnavailable: "未报告", depthSuffix: " 位浏览器颜色缓冲",
  },
  de: {
    modes: ["Erkennung", "Dynamikumfang", "Großer Farbraum"], name: "HDR-Test", status: "{mode}, {current} von {total}.", surface: "HDR-Test im Vollbild: {mode}", modeLabel: "HDR-Testmodus",
    report: "Browser- und Ausgabestatus", hdr: "HDR erkannt", sdr: "SDR gemeldet", unavailable: "Abfrage nicht verfügbar", checking: "Browserbericht wird geprüft",
    fields: ["Dynamikumfang", "Farbraum", "Farbpuffer", "Bildschirmgröße", "Skalierung"],
    limitation: "Diese Signale messen weder Spitzenhelligkeit noch Kontrast, Zertifizierung oder native Panel-Bittiefe.",
    black: "Reines Schwarz", white: "Referenzweiß und Lichtertrennung", colors: ["Rot", "Grün", "Orange"],
    gamutNote: "Gleich aussehende Spalten beweisen keinen kleinen Farbraum. Browser, System, Profil und Display können Farben angleichen.",
    high: "Hoher Dynamikumfang gemeldet", standard: "Standard-Dynamikumfang gemeldet", gamutUnavailable: "Farbraumabfrage nicht verfügbar", depthUnavailable: "Nicht gemeldet", depthSuffix: "-Bit-Farbpuffer des Browsers",
  },
} as const;

function readCapabilities(): HdrCapabilityReport {
  const match = (query: string) =>
    typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : null;

  return createHdrCapabilityReport({
    dynamicRangeHigh: match("(dynamic-range: high)"),
    p3: match("(color-gamut: p3)"),
    rec2020: match("(color-gamut: rec2020)"),
    colorDepth:
      typeof window.screen.colorDepth === "number"
        ? window.screen.colorDepth
        : null,
    width: window.screen.width,
    height: window.screen.height,
    devicePixelRatio: window.devicePixelRatio || 1,
  });
}

function DetectionPattern({ report, locale }: { report: HdrCapabilityReport | null; locale: Locale }) {
  const copy = HDR_UI[locale];
  const gamut = !report ? copy.checking : report.rec2020 === null || report.p3 === null ? copy.gamutUnavailable : report.rec2020 ? "Rec. 2020" : report.p3 ? "Display P3" : "sRGB";
  const items = [
    [copy.fields[0], !report ? copy.checking : report.dynamicRangeHigh === null ? copy.unavailable : report.dynamicRangeHigh ? copy.high : copy.standard],
    [copy.fields[1], gamut],
    [copy.fields[2], !report ? copy.checking : report.colorDepth === null ? copy.depthUnavailable : locale === "zh" ? `${report.colorDepth}${copy.depthSuffix}` : `${report.colorDepth}${copy.depthSuffix}`],
    [copy.fields[3], report?.resolutionLabel ?? copy.checking],
    [copy.fields[4], report?.scaleLabel ?? copy.checking],
  ] as const;

  return (
    <div className={styles.hdrDetectionPattern}>
      <div className={styles.hdrDetectionHeading}>
        <span>{copy.report}</span>
        <strong>
          {report?.dynamicRangeHigh === true
            ? copy.hdr
            : report?.dynamicRangeHigh === false
              ? copy.sdr
              : copy.unavailable}
        </strong>
      </div>
      <dl className={styles.hdrCapabilityGrid}>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p>
        {copy.limitation}
      </p>
    </div>
  );
}

function DynamicRangePattern({ locale }: { locale: Locale }) {
  const copy = HDR_UI[locale];
  const shadowLevels = ["0", "1", "2", "4", "8", "12"] as const;
  const highlightLevels = ["92", "95", "97", "98", "99", "100"] as const;

  return (
    <div className={styles.hdrDynamicPattern}>
      <div className={styles.hdrBlackField}>
        <span>{copy.black}</span>
        <div className={styles.hdrShadowSteps}>
          {shadowLevels.map((level) => (
            <i key={level} style={{ background: `rgb(${level} ${level} ${level})` }}>
              {level}
            </i>
          ))}
        </div>
      </div>
      <div className={styles.hdrHighlightField}>
        <span>{copy.white}</span>
        <div className={styles.hdrHighlightWindow} aria-hidden="true" />
        <div className={styles.hdrHighlightSteps}>
          {highlightLevels.map((level) => (
            <i key={level} style={{ background: `rgb(${level}% ${level}% ${level}%)` }}>
              {level}%
            </i>
          ))}
        </div>
      </div>
    </div>
  );
}

function WideGamutPattern({ locale }: { locale: Locale }) {
  const copy = HDR_UI[locale];
  const pairs = [
    { key: "red", label: copy.colors[0], srgb: "rgb(255 32 48)" },
    { key: "green", label: copy.colors[1], srgb: "rgb(0 210 91)" },
    { key: "orange", label: copy.colors[2], srgb: "rgb(255 119 0)" },
  ] as const;

  return (
    <div className={styles.hdrGamutPattern}>
      <div className={styles.hdrGamutLabels} aria-hidden="true">
        <span>sRGB</span>
        <span>Display P3</span>
        <span>Rec. 2020</span>
      </div>
      {pairs.map((pair) => (
        <div className={styles.hdrGamutRow} key={pair.label}>
          <strong>{pair.label}</strong>
          <span style={{ background: pair.srgb }} />
          <span
            className={styles.hdrWideSample}
            data-color={pair.key}
            data-gamut="p3"
            style={{ background: pair.srgb }}
          />
          <span
            className={styles.hdrWideSample}
            data-color={pair.key}
            data-gamut="rec2020"
            style={{ background: pair.srgb }}
          />
        </div>
      ))}
      <p>
        {copy.gamutNote}
      </p>
    </div>
  );
}

export function HdrTest({ locale = "en" }: { locale?: Locale } = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [report, setReport] = useState<HdrCapabilityReport | null>(null);
  const copy = HDR_UI[locale];
  const mode = copy.modes[activeIndex];

  useEffect(() => {
    const queries = [
      window.matchMedia?.("(dynamic-range: high)"),
      window.matchMedia?.("(color-gamut: p3)"),
      window.matchMedia?.("(color-gamut: rec2020)"),
    ].filter((query): query is MediaQueryList => Boolean(query));
    const update = () => setReport(readCapabilities());

    update();
    window.addEventListener("resize", update);
    queries.forEach((query) => query.addEventListener?.("change", update));
    return () => {
      window.removeEventListener("resize", update);
      queries.forEach((query) => query.removeEventListener?.("change", update));
    };
  }, []);

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
      name={copy.name}
      onNext={showNext}
      onPrevious={showPrevious}
      startEventName={testStartEventName("hdr-test")}
      status={copy.status.replace("{mode}", mode).replace("{current}", String(activeIndex + 1)).replace("{total}", String(MODES.length))}
      surfaceLabel={copy.surface.replace("{mode}", mode)}
      toolbarLayout="docked"
      controls={
        <div aria-label={copy.modeLabel} className={styles.toolGroup} role="group">
          {copy.modes.map((item, index) => (
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
    >
      {activeIndex === 0 ? <DetectionPattern locale={locale} report={report} /> : null}
      {activeIndex === 1 ? <DynamicRangePattern locale={locale} /> : null}
      {activeIndex === 2 ? <WideGamutPattern locale={locale} /> : null}
    </FullscreenTest>
  );
}
