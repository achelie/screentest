"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createHdrCapabilityReport,
  type HdrCapabilityReport,
} from "@/lib/hdr-test";
import { testStartEventName } from "@/lib/test-events";
import { FullscreenTest } from "./FullscreenTest";
import styles from "./ScreenTests.module.css";

const MODES = ["Detection", "Dynamic range", "Wide gamut"] as const;

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

function DetectionPattern({ report }: { report: HdrCapabilityReport | null }) {
  const items = [
    ["Dynamic range", report?.dynamicRangeLabel ?? "Checking browser report"],
    ["Color gamut", report?.gamutLabel ?? "Checking browser report"],
    ["Color buffer", report?.colorDepthLabel ?? "Checking browser report"],
    ["Screen size", report?.resolutionLabel ?? "Checking browser report"],
    ["Scale", report?.scaleLabel ?? "Checking browser report"],
  ] as const;

  return (
    <div className={styles.hdrDetectionPattern}>
      <div className={styles.hdrDetectionHeading}>
        <span>Browser and output report</span>
        <strong>
          {report?.dynamicRangeHigh === true
            ? "HDR capable"
            : report?.dynamicRangeHigh === false
              ? "SDR reported"
              : "Query unavailable"}
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
        Capability signals do not measure peak brightness, contrast, certification,
        or native panel bit depth.
      </p>
    </div>
  );
}

function DynamicRangePattern() {
  const shadowLevels = ["0", "1", "2", "4", "8", "12"] as const;
  const highlightLevels = ["92", "95", "97", "98", "99", "100"] as const;

  return (
    <div className={styles.hdrDynamicPattern}>
      <div className={styles.hdrBlackField}>
        <span>Pure black</span>
        <div className={styles.hdrShadowSteps}>
          {shadowLevels.map((level) => (
            <i key={level} style={{ background: `rgb(${level} ${level} ${level})` }}>
              {level}
            </i>
          ))}
        </div>
      </div>
      <div className={styles.hdrHighlightField}>
        <span>Reference white and highlight separation</span>
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

function WideGamutPattern() {
  const pairs = [
    { key: "red", label: "Red", srgb: "rgb(255 32 48)" },
    { key: "green", label: "Green", srgb: "rgb(0 210 91)" },
    { key: "orange", label: "Orange", srgb: "rgb(255 119 0)" },
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
        Equal-looking columns do not prove a narrow-gamut panel. The browser,
        operating system, profile, and display can map both colors.
      </p>
    </div>
  );
}

export function HdrTest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [report, setReport] = useState<HdrCapabilityReport | null>(null);
  const mode = MODES[activeIndex];

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
      advanceOnSurfaceClick
      name="HDR test"
      onNext={showNext}
      onPrevious={showPrevious}
      startEventName={testStartEventName("hdr-test")}
      status={`${mode}, ${activeIndex + 1} of ${MODES.length}.`}
      surfaceLabel={`Full-screen HDR test: ${mode.toLowerCase()}`}
      controls={
        <div aria-label="HDR test mode" className={styles.toolGroup} role="group">
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
    >
      {activeIndex === 0 ? <DetectionPattern report={report} /> : null}
      {activeIndex === 1 ? <DynamicRangePattern /> : null}
      {activeIndex === 2 ? <WideGamutPattern /> : null}
    </FullscreenTest>
  );
}
