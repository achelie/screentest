"use client";

import { useEffect, useRef, useState } from "react";

import {
  createScreenResolutionReport,
  RESOLUTION_COMPARISON_STANDARDS,
  type ScreenResolutionReport,
} from "@/lib/screen-resolution";
import { estimateSubmittedFps } from "@/lib/screen-tearing";
import { testStartEventName } from "@/lib/test-events";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

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

export function ScreenResolutionChecker() {
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
    ["Reported screen", report?.reportedScreenLabel ?? "Checking…"],
    ["Layout viewport", report?.viewportLabel ?? "Checking…"],
    ["Visible viewport", report?.visualViewportLabel ?? "Checking…"],
    ["Available area", report?.availableAreaLabel ?? "Checking…"],
    ["Pixel ratio", report?.devicePixelRatioLabel ?? "Checking…"],
    ["Aspect ratio", report?.aspectRatioLabel ?? "Checking…"],
    ["Orientation", report?.orientationLabel ?? "Checking…"],
    ["Color buffer", report?.colorDepthLabel ?? "Checking…"],
    ["Display mode", report?.displayModeLabel ?? "Checking…"],
    [
      "Browser frame cadence",
      frameCadence === null ? "Measuring…" : `About ${frameCadence} fps`,
    ],
  ] as const;

  const markerPosition = report?.estimatedWidth
    ? Math.min(100, (report.estimatedWidth / MAX_COMPARISON_WIDTH) * 100)
    : 0;

  return (
    <FullscreenTest
      hostClassName={styles.resolutionHost}
      name="Screen resolution checker"
      shortcutHint="F fullscreen, H hide controls"
      startEventName={testStartEventName("screen-resolution-checker")}
      status="Live measurements update when this window or display changes."
      surfaceLabel="Live screen resolution, viewport, pixel ratio, and browser frame cadence measurements"
      surfaceRole="group"
      toolbarLayout="docked"
    >
      <div className={styles.resolutionWorkbench}>
        <span aria-hidden="true" className={styles.resolutionCornerMark} data-corner="top-left" />
        <span aria-hidden="true" className={styles.resolutionCornerMark} data-corner="bottom-right" />

        <section className={styles.resolutionPrimary}>
          <div>
            <p>Estimated output pixels</p>
            <strong>
              {report?.estimatedWidth && report.estimatedHeight
                ? `${report.estimatedWidth} × ${report.estimatedHeight}`
                : "Checking display…"}
            </strong>
          </div>
          <dl>
            <div>
              <dt>Output class</dt>
              <dd>{report?.resolutionClassLabel ?? "Checking…"}</dd>
            </div>
            <div>
              <dt>Pixel count</dt>
              <dd>{report?.megapixelsLabel ?? "Checking…"}</dd>
            </div>
          </dl>
        </section>

        <dl className={styles.resolutionMetrics}>
          {metrics.map(([label, value]) => (
            <Metric key={label} label={label} value={value} />
          ))}
        </dl>

        <section aria-label="Resolution width comparison" className={styles.resolutionRuler}>
          <div className={styles.resolutionRulerHeader}>
            <span>Horizontal output comparison</span>
            <strong>{report?.estimatedWidth ? `${report.estimatedWidth}px wide` : "Waiting for display"}</strong>
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
                <b>Yours</b>
              </span>
            ) : null}
          </div>
        </section>

        <p className={styles.resolutionNote}>
          For the cleanest estimate, set browser zoom to 100%. Frame cadence is
          browser animation timing, not a monitor refresh-rate reading.
        </p>
      </div>
    </FullscreenTest>
  );
}
