import assert from "node:assert/strict";
import test from "node:test";

import { createHdrCapabilityReport } from "./hdr-test";

const baseInput = {
  colorDepth: 24,
  width: 1920,
  height: 1080,
  devicePixelRatio: 1,
} as const;

test("reports HDR and Rec. 2020 when the browser environment exposes both", () => {
  const report = createHdrCapabilityReport({
    ...baseInput,
    dynamicRangeHigh: true,
    p3: true,
    rec2020: true,
  });

  assert.equal(report.dynamicRangeLabel, "High dynamic range reported");
  assert.equal(report.gamutLabel, "Rec. 2020 reported");
  assert.equal(report.colorDepthLabel, "24-bit browser color buffer");
});

test("reports P3 without claiming Rec. 2020", () => {
  const report = createHdrCapabilityReport({
    ...baseInput,
    dynamicRangeHigh: true,
    p3: true,
    rec2020: false,
  });

  assert.equal(report.gamutLabel, "Display P3 reported");
});

test("falls back to SDR and sRGB when media queries do not match", () => {
  const report = createHdrCapabilityReport({
    ...baseInput,
    dynamicRangeHigh: false,
    p3: false,
    rec2020: false,
  });

  assert.equal(report.dynamicRangeLabel, "Standard dynamic range reported");
  assert.equal(report.gamutLabel, "sRGB reported");
});

test("distinguishes unavailable media queries from an SDR result", () => {
  const report = createHdrCapabilityReport({
    ...baseInput,
    dynamicRangeHigh: null,
    p3: null,
    rec2020: null,
  });

  assert.equal(report.dynamicRangeLabel, "Dynamic range query unavailable");
  assert.equal(report.gamutLabel, "Color gamut query unavailable");
});

test("labels browser color depth without calling it native panel bit depth", () => {
  const report = createHdrCapabilityReport({
    ...baseInput,
    dynamicRangeHigh: false,
    p3: false,
    rec2020: false,
    colorDepth: null,
    devicePixelRatio: 1.25,
  });

  assert.equal(report.colorDepthLabel, "Not reported");
  assert.equal(report.resolutionLabel, "1920 × 1080 CSS px");
  assert.equal(report.scaleLabel, "1.25×");
});
