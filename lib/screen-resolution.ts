export type ScreenResolutionInput = {
  readonly screenWidth: number | null;
  readonly screenHeight: number | null;
  readonly availableWidth: number | null;
  readonly availableHeight: number | null;
  readonly viewportWidth: number | null;
  readonly viewportHeight: number | null;
  readonly visualViewportWidth: number | null;
  readonly visualViewportHeight: number | null;
  readonly visualViewportScale: number | null;
  readonly devicePixelRatio: number | null;
  readonly colorDepth: number | null;
  readonly orientationType: string | null;
  readonly orientationAngle: number | null;
  readonly fullscreen: boolean;
};

export type ScreenResolutionReport = {
  readonly estimatedWidth: number | null;
  readonly estimatedHeight: number | null;
  readonly estimatedOutputLabel: string;
  readonly reportedScreenLabel: string;
  readonly availableAreaLabel: string;
  readonly viewportLabel: string;
  readonly visualViewportLabel: string;
  readonly devicePixelRatioLabel: string;
  readonly aspectRatioLabel: string;
  readonly megapixelsLabel: string;
  readonly colorDepthLabel: string;
  readonly orientationLabel: string;
  readonly displayModeLabel: "Fullscreen" | "Windowed";
  readonly resolutionClassLabel: string;
};

const RESOLUTION_STANDARDS = [
  { width: 1280, height: 720, label: "HD" },
  { width: 1920, height: 1080, label: "Full HD" },
  { width: 2560, height: 1440, label: "QHD" },
  { width: 3840, height: 2160, label: "4K UHD" },
  { width: 5120, height: 2880, label: "5K" },
  { width: 7680, height: 4320, label: "8K UHD" },
] as const;

const COMMON_ASPECT_RATIOS = [
  [32, 9],
  [21, 9],
  [16, 9],
  [16, 10],
  [3, 2],
  [4, 3],
] as const;

function finitePositive(value: number | null) {
  return value !== null && Number.isFinite(value) && value > 0 ? value : null;
}

function roundedDimension(value: number | null) {
  const safe = finitePositive(value);
  return safe === null ? null : Math.round(safe);
}

function formatDimensions(width: number | null, height: number | null, suffix: string) {
  const safeWidth = roundedDimension(width);
  const safeHeight = roundedDimension(height);

  return safeWidth === null || safeHeight === null
    ? "Not reported"
    : `${safeWidth} × ${safeHeight} ${suffix}`;
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
}

export function calculateEstimatedOutput(
  screenWidth: number | null,
  screenHeight: number | null,
  devicePixelRatio: number | null,
) {
  const width = finitePositive(screenWidth);
  const height = finitePositive(screenHeight);
  const ratio = finitePositive(devicePixelRatio);

  if (width === null || height === null || ratio === null) {
    return { width: null, height: null } as const;
  }

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  } as const;
}

export function formatAspectRatio(width: number | null, height: number | null) {
  const safeWidth = roundedDimension(width);
  const safeHeight = roundedDimension(height);

  if (safeWidth === null || safeHeight === null) return "Not reported";

  const ratio = safeWidth / safeHeight;
  for (const [commonWidth, commonHeight] of COMMON_ASPECT_RATIOS) {
    const landscapeRatio = commonWidth / commonHeight;
    const portraitRatio = commonHeight / commonWidth;

    if (Math.abs(ratio - landscapeRatio) / landscapeRatio <= 0.03) {
      return `${commonWidth}:${commonHeight}`;
    }

    if (Math.abs(ratio - portraitRatio) / portraitRatio <= 0.03) {
      return `${commonHeight}:${commonWidth}`;
    }
  }

  const divisor = greatestCommonDivisor(safeWidth, safeHeight);
  return `${safeWidth / divisor}:${safeHeight / divisor}`;
}

export function identifyResolutionClass(width: number | null, height: number | null) {
  const safeWidth = roundedDimension(width);
  const safeHeight = roundedDimension(height);

  if (safeWidth === null || safeHeight === null) return "Not reported";

  const match = RESOLUTION_STANDARDS.find(
    (standard) =>
      (standard.width === safeWidth && standard.height === safeHeight) ||
      (standard.width === safeHeight && standard.height === safeWidth),
  );

  return match?.label ?? "Custom output";
}

function formatOrientation(
  type: string | null,
  angle: number | null,
  width: number | null,
  height: number | null,
) {
  const normalizedType = type?.replace("-", " ");
  const fallback =
    finitePositive(width) !== null && finitePositive(height) !== null
      ? Number(width) >= Number(height)
        ? "landscape"
        : "portrait"
      : "Not reported";
  const base = normalizedType
    ? normalizedType.replace(/^./u, (letter) => letter.toUpperCase())
    : fallback.replace(/^./u, (letter) => letter.toUpperCase());

  return angle !== null && Number.isFinite(angle) ? `${base} · ${angle}°` : base;
}

export function createScreenResolutionReport(
  input: ScreenResolutionInput,
): ScreenResolutionReport {
  const estimated = calculateEstimatedOutput(
    input.screenWidth,
    input.screenHeight,
    input.devicePixelRatio,
  );
  const dpr = finitePositive(input.devicePixelRatio);
  const visualScale = finitePositive(input.visualViewportScale);
  const totalPixels =
    estimated.width !== null && estimated.height !== null
      ? estimated.width * estimated.height
      : null;

  return {
    estimatedWidth: estimated.width,
    estimatedHeight: estimated.height,
    estimatedOutputLabel: formatDimensions(
      estimated.width,
      estimated.height,
      "estimated device px",
    ),
    reportedScreenLabel: formatDimensions(
      input.screenWidth,
      input.screenHeight,
      "CSS px",
    ),
    availableAreaLabel: formatDimensions(
      input.availableWidth,
      input.availableHeight,
      "CSS px",
    ),
    viewportLabel: formatDimensions(
      input.viewportWidth,
      input.viewportHeight,
      "CSS px",
    ),
    visualViewportLabel:
      input.visualViewportWidth === null || input.visualViewportHeight === null
        ? "Not supported"
        : `${formatDimensions(
            input.visualViewportWidth,
            input.visualViewportHeight,
            "CSS px",
          )}${visualScale !== null ? ` · ${Number(visualScale.toFixed(2))}× view scale` : ""}`,
    devicePixelRatioLabel:
      dpr === null ? "Not reported" : `${Number(dpr.toFixed(2))}× DPR`,
    aspectRatioLabel: formatAspectRatio(estimated.width, estimated.height),
    megapixelsLabel:
      totalPixels === null ? "Not reported" : `${(totalPixels / 1_000_000).toFixed(2)} MP estimated`,
    colorDepthLabel:
      finitePositive(input.colorDepth) === null
        ? "Not reported"
        : `${Math.round(Number(input.colorDepth))}-bit browser buffer`,
    orientationLabel: formatOrientation(
      input.orientationType,
      input.orientationAngle,
      input.screenWidth,
      input.screenHeight,
    ),
    displayModeLabel: input.fullscreen ? "Fullscreen" : "Windowed",
    resolutionClassLabel: identifyResolutionClass(
      estimated.width,
      estimated.height,
    ),
  };
}

export const RESOLUTION_COMPARISON_STANDARDS = RESOLUTION_STANDARDS;
