import {
  Activity,
  Blend,
  CircleDot,
  Moon,
  Palette,
  ScanSearch,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

import type { TestIconName } from "@/lib/tests";

const ICONS: Record<TestIconName, LucideIcon> = {
  scan: ScanSearch,
  pixel: CircleDot,
  dark: Moon,
  grayscale: SlidersHorizontal,
  gradient: Blend,
  motion: Activity,
  color: Palette,
};

type TestIconProps = {
  name: TestIconName;
  size?: number;
  className?: string;
};

export function TestIcon({ name, size = 20, className }: TestIconProps) {
  const Icon = ICONS[name];

  return (
    <Icon
      aria-hidden="true"
      className={className}
      focusable="false"
      size={size}
      strokeWidth={1.8}
    />
  );
}
