import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEstimatedOutput,
  createScreenResolutionReport,
  formatAspectRatio,
  identifyResolutionClass,
} from "./screen-resolution";

const baseInput = {
  screenWidth: 1536,
  screenHeight: 864,
  availableWidth: 1536,
  availableHeight: 816,
  viewportWidth: 1280,
  viewportHeight: 720,
  visualViewportWidth: 1280,
  visualViewportHeight: 720,
  visualViewportScale: 1,
  devicePixelRatio: 1.25,
  colorDepth: 24,
  orientationType: "landscape-primary",
  orientationAngle: 0,
  fullscreen: false,
} as const;

test("estimates device output from the reported CSS screen and DPR", () => {
  assert.deepEqual(calculateEstimatedOutput(1536, 864, 1.25), {
    width: 1920,
    height: 1080,
  });

  const report = createScreenResolutionReport(baseInput);
  assert.equal(report.estimatedOutputLabel, "1920 × 1080 estimated device px");
  assert.equal(report.reportedScreenLabel, "1536 × 864 CSS px");
  assert.equal(report.devicePixelRatioLabel, "1.25× DPR");
  assert.equal(report.megapixelsLabel, "2.07 MP estimated");
});

test("falls back safely for non-finite and invalid measurements", () => {
  assert.deepEqual(calculateEstimatedOutput(Number.NaN, 1080, 1), {
    width: null,
    height: null,
  });
  assert.deepEqual(calculateEstimatedOutput(1920, 1080, 0), {
    width: null,
    height: null,
  });

  const report = createScreenResolutionReport({
    ...baseInput,
    screenWidth: Number.POSITIVE_INFINITY,
    devicePixelRatio: null,
    colorDepth: -1,
  });
  assert.equal(report.estimatedOutputLabel, "Not reported");
  assert.equal(report.devicePixelRatioLabel, "Not reported");
  assert.equal(report.colorDepthLabel, "Not reported");
});

test("formats common desktop, portrait, and ultrawide aspect ratios", () => {
  assert.equal(formatAspectRatio(3840, 2160), "16:9");
  assert.equal(formatAspectRatio(1080, 1920), "9:16");
  assert.equal(formatAspectRatio(3440, 1440), "21:9");
  assert.equal(formatAspectRatio(1280, 1024), "5:4");
});

test("identifies exact standards without forcing custom outputs into a class", () => {
  assert.equal(identifyResolutionClass(2560, 1440), "QHD");
  assert.equal(identifyResolutionClass(2160, 3840), "4K UHD");
  assert.equal(identifyResolutionClass(3440, 1440), "Custom output");
});

test("reports optional visual viewport and fullscreen state", () => {
  const report = createScreenResolutionReport({
    ...baseInput,
    visualViewportWidth: null,
    visualViewportHeight: null,
    visualViewportScale: null,
    orientationType: null,
    orientationAngle: null,
    fullscreen: true,
  });

  assert.equal(report.visualViewportLabel, "Not supported");
  assert.equal(report.orientationLabel, "Landscape");
  assert.equal(report.displayModeLabel, "Fullscreen");
});
