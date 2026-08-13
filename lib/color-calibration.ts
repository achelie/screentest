export function linearLightToSrgb8Bit(value: number): number {
  if (!Number.isFinite(value)) return 0;

  const linear = Math.min(1, Math.max(0, value));
  const encoded =
    linear <= 0.0031308
      ? linear * 12.92
      : 1.055 * linear ** (1 / 2.4) - 0.055;

  return Math.round(encoded * 255);
}

