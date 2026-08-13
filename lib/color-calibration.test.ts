import assert from "node:assert/strict";
import test from "node:test";

import { linearLightToSrgb8Bit } from "./color-calibration";

test("encodes the ends of the sRGB range", () => {
  assert.equal(linearLightToSrgb8Bit(0), 0);
  assert.equal(linearLightToSrgb8Bit(1), 255);
});

test("encodes 50 percent relative light near sRGB 188", () => {
  assert.equal(linearLightToSrgb8Bit(0.5), 188);
});

test("clamps values outside the display range", () => {
  assert.equal(linearLightToSrgb8Bit(-0.5), 0);
  assert.equal(linearLightToSrgb8Bit(1.5), 255);
});

test("falls back safely for non-finite input", () => {
  assert.equal(linearLightToSrgb8Bit(Number.NaN), 0);
  assert.equal(linearLightToSrgb8Bit(Number.POSITIVE_INFINITY), 0);
  assert.equal(linearLightToSrgb8Bit(Number.NEGATIVE_INFINITY), 0);
});

