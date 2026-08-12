export type HdrCapabilityInput = {
  readonly dynamicRangeHigh: boolean | null;
  readonly p3: boolean | null;
  readonly rec2020: boolean | null;
  readonly colorDepth: number | null;
  readonly width: number;
  readonly height: number;
  readonly devicePixelRatio: number;
};

export type HdrCapabilityReport = HdrCapabilityInput & {
  readonly dynamicRangeLabel:
    | "High dynamic range reported"
    | "Standard dynamic range reported"
    | "Dynamic range query unavailable";
  readonly gamutLabel:
    | "Rec. 2020 reported"
    | "Display P3 reported"
    | "sRGB reported"
    | "Color gamut query unavailable";
  readonly colorDepthLabel: string;
  readonly resolutionLabel: string;
  readonly scaleLabel: string;
};

export function createHdrCapabilityReport(
  input: HdrCapabilityInput,
): HdrCapabilityReport {
  return {
    ...input,
    dynamicRangeLabel:
      input.dynamicRangeHigh === null
        ? "Dynamic range query unavailable"
        : input.dynamicRangeHigh
          ? "High dynamic range reported"
          : "Standard dynamic range reported",
    gamutLabel:
      input.rec2020 === null || input.p3 === null
        ? "Color gamut query unavailable"
        : input.rec2020
          ? "Rec. 2020 reported"
          : input.p3
            ? "Display P3 reported"
            : "sRGB reported",
    colorDepthLabel:
      input.colorDepth === null
        ? "Not reported"
        : `${input.colorDepth}-bit browser color buffer`,
    resolutionLabel: `${Math.round(input.width)} × ${Math.round(input.height)} CSS px`,
    scaleLabel: `${Number(input.devicePixelRatio.toFixed(2))}×`,
  };
}
