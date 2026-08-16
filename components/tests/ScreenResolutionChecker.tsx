"use client";

import { useEffect, useRef, useState } from "react";

import {
  createScreenResolutionReport,
  RESOLUTION_COMPARISON_STANDARDS,
  type ScreenResolutionReport,
} from "@/lib/screen-resolution";
import { estimateSubmittedFps } from "@/lib/screen-tearing";
import { testStartEventName } from "@/lib/test-events";
import { getTestMessages } from "@/lib/test-messages";
import type { Locale } from "@/lib/i18n";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const RESOLUTION_UI = {
  en: { metrics: ["Reported screen", "Layout viewport", "Visible viewport", "Available area", "Pixel ratio", "Aspect ratio", "Orientation", "Color buffer", "Display mode", "Browser frame cadence"], checking: "Checking…", measuring: "Measuring…", about: "About {fps} fps", name: "Screen resolution checker", shortcut: "F fullscreen, H hide controls", status: "Live measurements update when this window or display changes.", surface: "Live screen resolution, viewport, pixel ratio, and browser frame cadence measurements", estimated: "Estimated output pixels", checkingDisplay: "Checking display…", outputClass: "Output class", pixelCount: "Pixel count", rulerAria: "Resolution width comparison", comparison: "Horizontal output comparison", wide: "{width}px wide", waiting: "Waiting for display", yours: "Yours", note: "For the cleanest estimate, set browser zoom to 100%. Frame cadence is browser animation timing, not a monitor refresh-rate reading." },
  zh: { metrics: ["报告的屏幕", "布局视口", "可见视口", "可用区域", "设备像素比", "宽高比", "方向", "颜色缓冲", "显示模式", "浏览器帧率"], checking: "正在检查…", measuring: "正在测量…", about: "约 {fps} fps", name: "屏幕分辨率检测", shortcut: "F 全屏，H 隐藏控制栏", status: "窗口或显示器变化时，实时测量会自动更新。", surface: "实时屏幕分辨率、视口、像素比与浏览器帧率测量", estimated: "估算输出像素", checkingDisplay: "正在检查显示器…", outputClass: "分辨率级别", pixelCount: "像素数量", rulerAria: "分辨率宽度对比", comparison: "横向输出对比", wide: "宽 {width}px", waiting: "等待显示器数据", yours: "当前设备", note: "为获得更干净的估算，请把浏览器缩放设为 100%。这里的帧率是浏览器动画计时，不是显示器刷新率。" },
  de: { metrics: ["Gemeldeter Bildschirm", "Layout-Viewport", "Sichtbarer Viewport", "Verfügbarer Bereich", "Pixelverhältnis", "Seitenverhältnis", "Ausrichtung", "Farbpuffer", "Anzeigemodus", "Browser-Frame-Takt"], checking: "Prüfung…", measuring: "Messung…", about: "Etwa {fps} fps", name: "Bildschirmauflösung prüfen", shortcut: "F Vollbild, H Steuerung ausblenden", status: "Live-Werte aktualisieren sich, wenn sich Fenster oder Display ändern.", surface: "Live-Werte für Bildschirmauflösung, Viewport, Pixelverhältnis und Browser-Frame-Takt", estimated: "Geschätzte Ausgabepixel", checkingDisplay: "Display wird geprüft…", outputClass: "Auflösungsklasse", pixelCount: "Pixelzahl", rulerAria: "Vergleich der Auflösungsbreite", comparison: "Horizontaler Ausgabevergleich", wide: "{width}px breit", waiting: "Warte auf Display", yours: "Deins", note: "Für die sauberste Schätzung stelle den Browserzoom auf 100 %. Der Frame-Takt ist Browser-Animationstiming, keine Messung der Monitorfrequenz." },
} as const;

function localizeResolutionValue(value: string, locale: Locale) {
  if (locale === "en") return value;
  const replacements = locale === "zh"
    ? [["Not reported", "未报告"], ["Not supported", "不支持"], ["estimated device px", "估算设备像素"], ["view scale", "视口缩放"], ["MP estimated", "MP（估算）"], ["-bit browser buffer", " 位浏览器缓冲"], ["Landscape", "横向"], ["Portrait", "纵向"], ["primary", "主方向"], ["secondary", "次方向"], ["Fullscreen", "全屏"], ["Windowed", "窗口"], ["Custom output", "自定义输出"]]
    : [["Not reported", "Nicht gemeldet"], ["Not supported", "Nicht unterstützt"], ["estimated device px", "geschätzte Gerätepixel"], ["view scale", "Viewport-Skalierung"], ["MP estimated", "MP geschätzt"], ["-bit browser buffer", "-Bit-Browserpuffer"], ["Landscape", "Querformat"], ["Portrait", "Hochformat"], ["primary", "primär"], ["secondary", "sekundär"], ["Fullscreen", "Vollbild"], ["Windowed", "Fenster"], ["Custom output", "Benutzerdefinierte Ausgabe"]];
  return replacements.reduce((result, [source, target]) => result.replace(source, target), value);
}

const FPS_SAMPLE_COUNT = 45;
const FPS_REPORT_INTERVAL_MS = 700;
const MAX_COMPARISON_WIDTH = 7680;

function readScreenResolution(): ScreenResolutionReport {
  const visualViewport = window.visualViewport;
  const orientation = window.screen.orientation;

  return createScreenResolutionReport({
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    availableWidth: window.screen.availWidth,
    availableHeight: window.screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    visualViewportWidth: visualViewport?.width ?? null,
    visualViewportHeight: visualViewport?.height ?? null,
    visualViewportScale: visualViewport?.scale ?? null,
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth:
      typeof window.screen.colorDepth === "number"
        ? window.screen.colorDepth
        : null,
    orientationType: orientation?.type ?? null,
    orientationAngle:
      typeof orientation?.angle === "number" ? orientation.angle : null,
    fullscreen: document.fullscreenElement !== null,
  });
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.resolutionMetric}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function ScreenResolutionChecker({ locale = "en" }: { locale?: Locale } = {}) {
  const copy = RESOLUTION_UI[locale];
  const frameRef = useRef<number | null>(null);
  const [report, setReport] = useState<ScreenResolutionReport | null>(null);
  const [frameCadence, setFrameCadence] = useState<number | null>(null);

  useEffect(() => {
    let resolutionQuery: MediaQueryList | null = null;
    let observedRatio: number | null = null;
    const orientation = window.screen.orientation;
    const visualViewport = window.visualViewport;

    const bindResolutionQuery = () => {
      const ratio = window.devicePixelRatio || 1;
      if (ratio === observedRatio) return;

      resolutionQuery?.removeEventListener?.("change", update);
      observedRatio = ratio;
      resolutionQuery = window.matchMedia?.(`(resolution: ${ratio}dppx)`) ?? null;
      resolutionQuery?.addEventListener?.("change", update);
    };

    function update() {
      setReport(readScreenResolution());
      bindResolutionQuery();
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    document.addEventListener("fullscreenchange", update);
    orientation?.addEventListener?.("change", update);
    visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.removeEventListener("fullscreenchange", update);
      orientation?.removeEventListener?.("change", update);
      visualViewport?.removeEventListener("resize", update);
      resolutionQuery?.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    let samples: number[] = [];
    let lastTime: number | null = null;
    let lastReportTime = 0;

    const stop = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    const animate = (time: number) => {
      if (document.visibilityState !== "visible") {
        stop();
        return;
      }

      if (lastTime !== null) {
        samples.push(time - lastTime);
        if (samples.length > FPS_SAMPLE_COUNT) samples.shift();

        if (time - lastReportTime >= FPS_REPORT_INTERVAL_MS) {
          setFrameCadence(estimateSubmittedFps(samples));
          lastReportTime = time;
        }
      }

      lastTime = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    const restart = () => {
      stop();
      samples = [];
      lastTime = null;
      lastReportTime = 0;
      setFrameCadence(null);
      if (document.visibilityState === "visible") {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", restart);
    restart();

    return () => {
      document.removeEventListener("visibilitychange", restart);
      stop();
    };
  }, []);

  const metrics = [
    [copy.metrics[0], report ? localizeResolutionValue(report.reportedScreenLabel, locale) : copy.checking],
    [copy.metrics[1], report ? localizeResolutionValue(report.viewportLabel, locale) : copy.checking],
    [copy.metrics[2], report ? localizeResolutionValue(report.visualViewportLabel, locale) : copy.checking],
    [copy.metrics[3], report ? localizeResolutionValue(report.availableAreaLabel, locale) : copy.checking],
    [copy.metrics[4], report ? localizeResolutionValue(report.devicePixelRatioLabel, locale) : copy.checking],
    [copy.metrics[5], report ? localizeResolutionValue(report.aspectRatioLabel, locale) : copy.checking],
    [copy.metrics[6], report ? localizeResolutionValue(report.orientationLabel, locale) : copy.checking],
    [copy.metrics[7], report ? localizeResolutionValue(report.colorDepthLabel, locale) : copy.checking],
    [copy.metrics[8], report ? localizeResolutionValue(report.displayModeLabel, locale) : copy.checking],
    [
      copy.metrics[9],
      frameCadence === null ? copy.measuring : copy.about.replace("{fps}", String(frameCadence)),
    ],
  ] as const;

  const markerPosition = report?.estimatedWidth
    ? Math.min(100, (report.estimatedWidth / MAX_COMPARISON_WIDTH) * 100)
    : 0;

  return (
    <FullscreenTest
      messages={getTestMessages(locale).fullscreen}
      hostClassName={styles.resolutionHost}
      name={copy.name}
      shortcutHint={copy.shortcut}
      startEventName={testStartEventName("screen-resolution-checker")}
      status={copy.status}
      surfaceLabel={copy.surface}
      surfaceRole="group"
      toolbarLayout="docked"
    >
      <div className={styles.resolutionWorkbench}>
        <span aria-hidden="true" className={styles.resolutionCornerMark} data-corner="top-left" />
        <span aria-hidden="true" className={styles.resolutionCornerMark} data-corner="bottom-right" />

        <section className={styles.resolutionPrimary}>
          <div>
            <p>{copy.estimated}</p>
            <strong>
              {report?.estimatedWidth && report.estimatedHeight
                ? `${report.estimatedWidth} × ${report.estimatedHeight}`
                : copy.checkingDisplay}
            </strong>
          </div>
          <dl>
            <div>
              <dt>{copy.outputClass}</dt>
              <dd>{report ? localizeResolutionValue(report.resolutionClassLabel, locale) : copy.checking}</dd>
            </div>
            <div>
              <dt>{copy.pixelCount}</dt>
              <dd>{report ? localizeResolutionValue(report.megapixelsLabel, locale) : copy.checking}</dd>
            </div>
          </dl>
        </section>

        <dl className={styles.resolutionMetrics}>
          {metrics.map(([label, value]) => (
            <Metric key={label} label={label} value={value} />
          ))}
        </dl>

        <section aria-label={copy.rulerAria} className={styles.resolutionRuler}>
          <div className={styles.resolutionRulerHeader}>
            <span>{copy.comparison}</span>
            <strong>{report?.estimatedWidth ? copy.wide.replace("{width}", String(report.estimatedWidth)) : copy.waiting}</strong>
          </div>
          <div aria-hidden="true" className={styles.resolutionRulerTrack}>
            {RESOLUTION_COMPARISON_STANDARDS.map((standard) => (
              <span
                className={styles.resolutionStandardMark}
                key={standard.label}
                style={{ left: `${(standard.width / MAX_COMPARISON_WIDTH) * 100}%` }}
              >
                <i />
                <b>{standard.label}</b>
              </span>
            ))}
            {report?.estimatedWidth ? (
              <span
                className={styles.resolutionCurrentMark}
                style={{ left: `${markerPosition}%` }}
              >
                <i />
                <b>{copy.yours}</b>
              </span>
            ) : null}
          </div>
        </section>

        <p className={styles.resolutionNote}>
          {copy.note}
        </p>
      </div>
    </FullscreenTest>
  );
}
