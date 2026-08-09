import type { TestDefinition } from "@/lib/tests";

import { BacklightBleedTest } from "./BacklightBleedTest";
import { ColorCycle } from "./ColorCycle";
import { GradientTest } from "./GradientTest";
import { GrayTest } from "./GrayTest";
import { GuidedScreenTest } from "./GuidedScreenTest";
import { MotionTest } from "./MotionTest";

type TestExperienceProps = {
  test: TestDefinition;
};

export function TestExperience({ test }: TestExperienceProps) {
  switch (test.tool) {
    case "guided":
      return <GuidedScreenTest />;
    case "dead-pixel":
      return <ColorCycle mode="dead-pixel" />;
    case "backlight-bleed":
      return <BacklightBleedTest />;
    case "grayscale":
      return <GrayTest />;
    case "gradient":
      return <GradientTest />;
    case "motion":
      return <MotionTest />;
    case "color":
      return <ColorCycle mode="color" />;
  }
}
