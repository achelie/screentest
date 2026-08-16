import type { TestDefinition } from "@/lib/tests";
import type { Locale } from "@/lib/i18n";
import { getTestMessages } from "@/lib/test-messages";

import { BacklightBleedTest } from "./BacklightBleedTest";
import { ColorCycle } from "./ColorCycle";
import { GradientTest } from "./GradientTest";
import { GrayTest } from "./GrayTest";
import { GuidedScreenTest } from "./GuidedScreenTest";
import { MotionTest } from "./MotionTest";

type TestExperienceProps = {
  test: TestDefinition;
  locale: Locale;
};

export function TestExperience({ test, locale }: TestExperienceProps) {
  const messages = getTestMessages(locale);
  switch (test.tool) {
    case "guided":
      return <GuidedScreenTest messages={{ fullscreen: messages.fullscreen, guided: messages.guided }} />;
    case "dead-pixel":
      return <ColorCycle mode="dead-pixel" messages={{ fullscreen: messages.fullscreen, colorCycle: messages.colorCycle }} />;
    case "backlight-bleed":
      return <BacklightBleedTest messages={{ fullscreen: messages.fullscreen, backlight: messages.backlight }} />;
    case "grayscale":
      return <GrayTest messages={{ fullscreen: messages.fullscreen, gray: messages.gray }} />;
    case "gradient":
      return <GradientTest messages={{ fullscreen: messages.fullscreen, gradient: messages.gradient }} />;
    case "motion":
      return <MotionTest messages={{ fullscreen: messages.fullscreen, motion: messages.motion }} />;
    case "color":
      return <ColorCycle mode="color" messages={{ fullscreen: messages.fullscreen, colorCycle: messages.colorCycle }} />;
  }
}
