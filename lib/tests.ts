export const TEST_SLUGS = [
  "guided",
  "dead-pixel",
  "backlight-bleed",
  "grayscale",
  "gradient",
  "motion",
  "color",
] as const;

export type TestSlug = (typeof TEST_SLUGS)[number];

export type TestTool =
  | "guided"
  | "dead-pixel"
  | "backlight-bleed"
  | "grayscale"
  | "gradient"
  | "motion"
  | "color";

export type TestIconName =
  | "scan"
  | "pixel"
  | "dark"
  | "grayscale"
  | "gradient"
  | "motion"
  | "color";

export type TestObservation = {
  readonly signal: string;
  readonly meaning: string;
};

export type TestFaq = {
  readonly question: string;
  readonly answer: string;
  readonly sourceHref?: string;
};

export type TestDefinition = {
  readonly slug: TestSlug;
  readonly name: string;
  readonly shortName: string;
  readonly seoTitle: string;
  readonly description: string;
  readonly intro: string;
  readonly duration: string;
  readonly icon: TestIconName;
  readonly tool: TestTool;
  readonly preparation: readonly string[];
  readonly observations: readonly TestObservation[];
  readonly limitation: string;
  readonly guideHref: `/guides${string}`;
  readonly guideLabel: string;
  readonly relatedTests: readonly TestSlug[];
  readonly faq?: readonly TestFaq[];
};

export const SCREEN_TESTS = [
  {
    slug: "guided",
    name: "Guided Screen Test",
    shortName: "Guided test",
    seoTitle: "Guided Screen Test: Check Your Monitor Online",
    description:
      "Run a free guided screen test for dead pixels, backlight bleed, grayscale uniformity, banding, color, and motion in your browser.",
    intro:
      "Six quick checks. Mark what you notice, then get a plain-English summary.",
    duration: "About 2 minutes",
    icon: "scan",
    tool: "guided",
    preparation: [
      "Clean the panel first. A crumb is a convincing dead pixel.",
      "Use the brightness level you normally use.",
      "Enter fullscreen when you are ready to inspect the edges.",
    ],
    observations: [
      {
        signal: "A dot stays fixed through several colors",
        meaning: "It may be a dead pixel or a stuck subpixel.",
      },
      {
        signal: "Gray areas look cloudy or tinted",
        meaning: "The panel may have a uniformity issue.",
      },
      {
        signal: "A smooth shade breaks into visible stripes",
        meaning: "You may be seeing gradient banding.",
      },
      {
        signal: "The moving target leaves a dark or bright trail",
        meaning: "The panel may show ghosting or overdrive overshoot.",
      },
    ],
    limitation:
      "This is a visual browser check, not a colorimeter or laboratory measurement.",
    guideHref: "/guides",
    guideLabel: "Browse the screen testing guides",
    relatedTests: ["dead-pixel", "backlight-bleed", "motion"],
  },
  {
    slug: "dead-pixel",
    name: "Dead Pixel Test Online",
    shortName: "Dead pixels",
    seoTitle: "Dead Pixel Test Online for Monitor, OLED and Android",
    description:
      "Use this free dead pixel test website with fullscreen colors to check monitors, OLED screens, laptops, and Android phones without installing an app.",
    intro:
      "Fill the screen with solid colors and look for a dot that refuses to change.",
    duration: "1-2 minutes",
    icon: "pixel",
    tool: "dead-pixel",
    preparation: [
      "Wipe away dust and fingerprints before you begin.",
      "Sit at your normal viewing distance, then move closer for a second pass.",
      "Check every color because a stuck subpixel can hide on one background.",
    ],
    observations: [
      {
        signal: "A pixel stays black on every color",
        meaning: "It is likely a dead pixel that is no longer lighting up.",
      },
      {
        signal: "A pixel stays red, green, blue, or white",
        meaning: "It is more likely a stuck subpixel than a fully dead pixel.",
      },
      {
        signal: "The mark appears in a screenshot on another display",
        meaning: "The problem is in the rendered image or software, not this panel.",
      },
    ],
    limitation:
      "A browser can reveal suspicious pixels, but it cannot confirm warranty eligibility or safely repair panel hardware.",
    guideHref: "/guides/check-dead-pixels",
    guideLabel: "Read how to check dead pixels",
    relatedTests: ["color", "grayscale", "guided"],
    faq: [
      {
        question: "How can I tell a dead pixel from a stuck pixel?",
        answer:
          "A dead pixel usually stays black on white, red, green, and blue screens. A stuck pixel keeps showing one color because one or more subpixels remain active. Check all five patterns before deciding. Dust can look identical, so clean the screen first.",
        sourceHref:
          "https://www.reddit.com/r/SteamDeck/comments/1psct7a/is_this_a_dead_pixel_1tb_oled/",
      },
      {
        question: "What should I do if an OLED dead pixel test finds one bad pixel?",
        answer:
          "That depends on where the pixel sits, whether you notice it in normal use, the seller's return window, and the manufacturer's pixel policy. Test the whole OLED panel, save a photo, and check the written policy before the easy return period ends. One failed pixel does not automatically qualify every display for warranty replacement.",
        sourceHref:
          "https://www.reddit.com/r/OLED_Gaming/comments/1po9qsl/would_you_return_an_oled_with_1_dead_pixel_if_it/",
      },
      {
        question: "Can dead pixels spread across an OLED display?",
        answer:
          "One isolated failed pixel does not necessarily spread. A growing row, cluster, or dark edge can indicate a wider panel or connection fault. Photograph the same fullscreen color at intervals. If the affected area grows, stop treating it as a single-pixel problem and contact the manufacturer.",
        sourceHref:
          "https://www.reddit.com/r/LGOLED/comments/1up9ntv/how_to_prevent_dead_pixels_from_spreading/",
      },
      {
        question: "Can a pixel refresh or flashing video fix a dead pixel?",
        answer:
          "A true dead pixel usually cannot be revived by software. A stuck subpixel may change after normal use or a manufacturer-provided panel refresh, but rapid flashing tools are not guaranteed and can add unnecessary wear. Use the display maker's documented maintenance feature and avoid pressing or rubbing an OLED panel.",
        sourceHref:
          "https://www.reddit.com/r/SteamDeck/comments/182pj4l/i_shouldnt_have_checked_for_dead_pixels/",
      },
      {
        question: "How do I run a dead pixel test on Android?",
        answer:
          "Open this page in Chrome on the Android phone, raise brightness to a comfortable level, tap Start Dead Pixel Test, and rotate through white, black, red, green, and blue. Inspect the camera cutout, rounded corners, and navigation-bar area. Browser fullscreen support varies, so hide browser controls if they remain visible.",
      },
      {
        question: "Why does the suspicious dot disappear in a screenshot?",
        answer:
          "A screenshot records the image sent to the display, not the physical panel. If the dot is absent when that screenshot is viewed on another working screen, the panel is the likely source. If the dot appears in the screenshot elsewhere, investigate the app, image, graphics driver, or operating system instead.",
      },
    ],
  },
  {
    slug: "backlight-bleed",
    name: "Backlight Bleed Test",
    shortName: "Backlight bleed",
    seoTitle: "Backlight Bleed Test: Fullscreen Black Screen",
    description:
      "Open a full-screen black test in a dark room to check a monitor or laptop for bright edges, cloudy corners, and uneven backlighting.",
    intro:
      "Use a black screen in a dark room and check the edges for bright patches.",
    duration: "About 1 minute",
    icon: "dark",
    tool: "backlight-bleed",
    preparation: [
      "Dim the room, but keep brightness at the level you actually use.",
      "Look straight at the panel from your normal seating position.",
      "Hide the controls so their light does not contaminate the test.",
    ],
    observations: [
      {
        signal: "A bright patch stays near an edge or corner",
        meaning: "It may be backlight bleed, especially if it stays put as you move.",
      },
      {
        signal: "The glow changes when your head moves",
        meaning: "It may be viewing-angle glow rather than fixed backlight bleed.",
      },
      {
        signal: "A phone photo looks worse than your eyes see",
        meaning: "Camera exposure can exaggerate glow. Judge the panel with your eyes first.",
      },
    ],
    limitation:
      "This test helps you compare visible patches. Panel type, viewing angle, room light, and camera exposure can change the result.",
    guideHref: "/guides/check-backlight-bleed",
    guideLabel: "Read the backlight bleed guide",
    relatedTests: ["grayscale", "dead-pixel", "guided"],
  },
  {
    slug: "grayscale",
    name: "Grayscale and Uniformity Test",
    shortName: "Grayscale",
    seoTitle: "Screen Uniformity Test: Fullscreen Grayscale",
    description:
      "Check screen uniformity with full-screen 5%, 10%, 25%, 50%, 75%, and 100% grayscale patterns generated in your browser.",
    intro:
      "Move through gray levels and look for cloudy patches, tint, or dirty-screen effect.",
    duration: "1-2 minutes",
    icon: "grayscale",
    tool: "grayscale",
    preparation: [
      "Let the display warm up if it has just been switched on.",
      "Use your normal brightness and sit directly in front of the panel.",
      "Scan the center, edges, and corners at every gray level.",
    ],
    observations: [
      {
        signal: "Gray looks darker in cloudy patches",
        meaning: "This can indicate brightness uniformity variation or dirty-screen effect.",
      },
      {
        signal: "One area shifts pink, green, or blue",
        meaning: "The panel may have tint uniformity variation.",
      },
      {
        signal: "Only very dark gray looks uneven",
        meaning: "Near-black behavior varies by panel type and can improve after warm-up.",
      },
    ],
    limitation:
      "Uniformity varies with viewing angle and panel technology. Compare what you see with your real use, not a camera alone.",
    guideHref: "/guides/test-screen-uniformity",
    guideLabel: "Read the screen uniformity guide",
    relatedTests: ["backlight-bleed", "gradient", "color"],
  },
  {
    slug: "gradient",
    name: "Gradient Banding Test",
    shortName: "Gradient banding",
    seoTitle: "Gradient Test: Check Your Monitor for Banding",
    description:
      "Display smooth neutral, red, green, and blue gradients to check a monitor for visible banding, abrupt steps, and color transitions.",
    intro:
      "Inspect smooth gradients for sudden bands, blocks, or color jumps.",
    duration: "About 1 minute",
    icon: "gradient",
    tool: "gradient",
    preparation: [
      "Turn off unusual contrast or color-enhancement modes if possible.",
      "View both horizontal and vertical gradients.",
      "Check neutral first, then compare the red, green, and blue channels.",
    ],
    observations: [
      {
        signal: "A smooth ramp breaks into hard stripes",
        meaning: "You are seeing banding somewhere in the display or rendering pipeline.",
      },
      {
        signal: "Banding appears in only one color channel",
        meaning: "A color setting or channel-specific panel behavior may be involved.",
      },
      {
        signal: "The bands change after a display-mode change",
        meaning: "Bit depth, color range, or processing settings may be contributing.",
      },
    ],
    limitation:
      "Browser color management, operating-system settings, bit depth, and panel processing can all affect a gradient.",
    guideHref: "/guides",
    guideLabel: "Browse the screen testing guides",
    relatedTests: ["grayscale", "color", "motion"],
  },
  {
    slug: "motion",
    name: "Motion and Ghosting Test",
    shortName: "Motion",
    seoTitle: "Monitor Motion Test: Check Ghosting and Blur",
    description:
      "Run a browser-based moving-target test at several speeds to look for monitor ghosting, dark smearing, bright trails, and uneven motion.",
    intro:
      "Follow a moving target and check for trails, smearing, or uneven movement.",
    duration: "About 1 minute",
    icon: "motion",
    tool: "motion",
    preparation: [
      "Use the refresh rate and overdrive setting you normally use.",
      "Start at 240 px/s, then increase the speed.",
      "Keep your eyes on the moving target rather than the edge of the screen.",
    ],
    observations: [
      {
        signal: "A dark trail follows the target",
        meaning: "Slow pixel transitions may be creating visible smearing.",
      },
      {
        signal: "A bright or inverted halo follows the target",
        meaning: "The display overdrive may be overshooting its target values.",
      },
      {
        signal: "Movement jumps or pauses",
        meaning: "Browser load, frame pacing, or refresh-rate configuration may be involved.",
      },
    ],
    limitation:
      "This browser test helps you see motion behavior. It is not a laboratory response-time measurement.",
    guideHref: "/guides/test-motion-blur",
    guideLabel: "Read the motion blur guide",
    relatedTests: ["gradient", "grayscale", "guided"],
  },
  {
    slug: "color",
    name: "Monitor Color Test",
    shortName: "Color",
    seoTitle: "Monitor Color Test: Fullscreen RGB and CMY",
    description:
      "Show full-screen red, green, blue, cyan, magenta, yellow, black, and white colors to inspect pixels, tint, and color uniformity.",
    intro:
      "Show full-screen primary and secondary colors without image compression.",
    duration: "1-2 minutes",
    icon: "color",
    tool: "color",
    preparation: [
      "Disable blue-light or night modes if you want a neutral comparison.",
      "Use manual switching first. Automatic cycling is optional.",
      "Compare regions of one screen, not two uncalibrated devices as an exact match.",
    ],
    observations: [
      {
        signal: "A dot remains the wrong color",
        meaning: "A subpixel may be stuck or no longer responding.",
      },
      {
        signal: "A solid color looks blotchy or tinted",
        meaning: "The panel may have color or brightness uniformity variation.",
      },
      {
        signal: "Two displays show different colors",
        meaning: "Different presets and calibration can cause this even when both panels work.",
      },
    ],
    limitation:
      "Solid colors reveal visual differences, but they do not calibrate a display or measure color accuracy.",
    guideHref: "/guides",
    guideLabel: "Browse the screen testing guides",
    relatedTests: ["dead-pixel", "grayscale", "gradient"],
  },
] as const satisfies readonly TestDefinition[];

export function isTestSlug(value: string): value is TestSlug {
  return TEST_SLUGS.includes(value as TestSlug);
}

export function getTestBySlug(slug: string): TestDefinition | undefined {
  return SCREEN_TESTS.find((test) => test.slug === slug);
}
