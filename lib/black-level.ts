export const BLACK_LEVEL_MODES = ["pure", "levels", "depth"] as const;

export type BlackLevelMode = (typeof BLACK_LEVEL_MODES)[number];

export const NEAR_BLACK_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const DEPTH_PATCH_LEVELS = [2, 4, 6, 8] as const;
export const DEPTH_COMPARE_LEVELS = [3, 5] as const;
export const DEPTH_STRIPE_LEVEL = 3;
export const NEAR_BLACK_RAMP_END = 20;

export function stepBlackLevelMode(
  current: BlackLevelMode,
  direction: -1 | 1,
): BlackLevelMode {
  const index = BLACK_LEVEL_MODES.indexOf(current);
  return BLACK_LEVEL_MODES[
    (index + direction + BLACK_LEVEL_MODES.length) % BLACK_LEVEL_MODES.length
  ];
}
