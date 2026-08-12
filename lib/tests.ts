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
  readonly keywords: readonly string[];
  readonly intro: string;
  readonly duration: string;
  readonly icon: TestIconName;
  readonly tool: TestTool;
  readonly preparation: readonly string[];
  readonly observations: readonly TestObservation[];
  readonly limitation: string;
  readonly relatedTests: readonly TestSlug[];
  readonly faq?: readonly TestFaq[];
};

export const SCREEN_TESTS = [
  {
    slug: "guided",
    name: "Monitor Test Online",
    shortName: "Guided test",
    seoTitle: "Monitor Test Online: Complete Browser Screen Test",
    description:
      "Run a free monitor test online for dead pixels, backlight bleed, screen uniformity, banding, color, and motion without installing software.",
    keywords: [
      "monitor test online",
      "screen test online",
      "monitor testing website",
      "display test online",
    ],
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
    relatedTests: ["dead-pixel", "backlight-bleed", "motion"],
    faq: [
      {
        question: "Which tests should I run on a new monitor?",
        answer:
          "Start with solid colors for bad pixels, black for edge glow, gray for uniformity, gradients for banding, and motion for trails. Run the checks during the return window, then repeat anything suspicious using the brightness and viewing distance you use every day.",
      },
      {
        question: "Should a monitor warm up before a screen test?",
        answer:
          "Yes. Give an LCD or OLED about 20 to 30 minutes if it has just been switched on. Near-black uniformity, brightness, and color can shift while the panel warms up. A quick first pass is still useful, but judge subtle issues after the display settles.",
      },
      {
        question: "Can a screenshot prove that my monitor is faulty?",
        answer:
          "No. A screenshot records the rendered image, not the physical panel. View the screenshot on a second working display. If the mark travels with the screenshot, investigate software or the graphics pipeline. If it stays only on the original screen, inspect the panel.",
      },
      {
        question: "Can an online monitor test replace professional measurement?",
        answer:
          "No. This screen test online is designed for visible defects and everyday comparisons. It cannot measure color accuracy, response time, luminance, or factory tolerance. Those checks need a colorimeter, high-speed camera, or controlled lab setup.",
      },
    ],
  },
  {
    slug: "dead-pixel",
    name: "Dead Pixel Test Online",
    shortName: "Dead pixels",
    seoTitle: "Dead Pixel Test Online for Monitor, OLED and Android",
    description:
      "Use this free dead pixel test website with fullscreen colors to check monitors, OLED screens, laptops, and Android phones without installing an app.",
    keywords: [
      "dead pixel test online",
      "dead pixel test website",
      "dead pixel test android",
      "oled dead pixel test",
    ],
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
      "Run a backlight bleed test with a fullscreen black screen to check a monitor, laptop, or IPS panel for bright edges, cloudy corners, and IPS glow.",
    keywords: [
      "backlight bleed test",
      "black screen test",
      "monitor backlight bleed test",
      "IPS glow test",
    ],
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
    relatedTests: ["grayscale", "dead-pixel", "guided"],
    faq: [
      {
        question: "Is this backlight bleed or IPS glow?",
        answer:
          "Backlight bleed usually stays in the same edge or corner. IPS glow changes with your head position, viewing distance, and angle. Look straight at the display, then move slightly left and right. A patch that changes a lot is more likely IPS glow than fixed bleed.",
      },
      {
        question: "Why does backlight bleed look worse in a phone photo?",
        answer:
          "Phone cameras often brighten a dark scene with longer exposure, high ISO, and automatic processing. That can turn mild glow into a dramatic cloud. Lock exposure if possible and judge the display with your eyes at normal brightness before using a photo as evidence.",
      },
      {
        question: "What brightness and room lighting should I use?",
        answer:
          "Test once in a dim room at your normal brightness. You can raise brightness for a stress check, but a maximum-brightness photo in total darkness does not represent most use. The useful question is whether you notice the patch in dark games or films from your normal seat.",
      },
      {
        question: "Can this black screen test check an OLED display?",
        answer:
          "It can reveal raised blacks, stuck pixels, or unwanted glow, but OLED panels do not have an LCD backlight, so the issue is not backlight bleed. Use the grayscale test as well because OLED near-black uniformity problems can be easier to see on dark gray than pure black.",
      },
      {
        question: "Should I return a monitor with visible backlight bleed?",
        answer:
          "Consider how visible it is in real content, your normal room, and your normal seat. Compare it with the seller's return terms and the maker's panel policy while the return window is open. A browser test can document the symptom, but it cannot decide warranty eligibility.",
      },
    ],
  },
  {
    slug: "grayscale",
    name: "Screen Uniformity Test",
    shortName: "Grayscale",
    seoTitle: "Screen Uniformity Test: Gray Screen and DSE Check",
    description:
      "Run a gray screen test at 5%, 10%, 25%, 50%, 75%, and 100% to check screen uniformity, OLED tint, and dirty screen effect online.",
    keywords: [
      "screen uniformity test",
      "gray screen test",
      "dirty screen effect test",
      "OLED uniformity test",
    ],
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
    relatedTests: ["backlight-bleed", "gradient", "color"],
    faq: [
      {
        question: "What is dirty screen effect on a monitor or TV?",
        answer:
          "Dirty screen effect is visible brightness or color variation across what should be an even field. It often looks like cloudy patches, vertical bands, or faint stains during camera pans, sports, and other flat scenes. Gray patterns make the variation easier to spot.",
      },
      {
        question: "Is uneven 5% gray normal on an OLED screen?",
        answer:
          "Some near-black variation is common, especially on a new panel or at very low brightness. Judge it from your normal seat after warm-up and check whether it appears in real dark content. Severe bands, tint, or blotches that remain distracting may justify contacting the seller.",
      },
      {
        question: "Should I run a pixel refresh before this OLED uniformity test?",
        answer:
          "Let the display complete its normal automatic maintenance first. Do not repeatedly run a manual panel refresh just to chase a test pattern because intensive refresh cycles can add wear. Follow the manufacturer's instructions if a real-content problem remains after normal use.",
      },
      {
        question: "Why does gray uniformity change when I move my head?",
        answer:
          "LCD viewing angles can shift brightness and tint across the screen, particularly on large panels viewed from close range. Test from the center at your normal distance. If the patch moves or changes as you move, viewing angle is contributing to what you see.",
      },
      {
        question: "Can a camera accurately capture dirty screen effect?",
        answer:
          "A photo can help document the location, but automatic exposure, lens shading, moire, and compression can add patterns that your eyes do not see. Use a locked exposure and compare the photo with the screen in person. Real content from your normal seat matters most.",
      },
    ],
  },
  {
    slug: "gradient",
    name: "Gradient Banding Test",
    shortName: "Gradient banding",
    seoTitle: "Gradient Banding Test: Check Monitor Color Banding",
    description:
      "Run a gradient banding test with neutral, red, green, and blue ramps to check a monitor for color banding, abrupt steps, and uneven transitions.",
    keywords: [
      "gradient banding test",
      "monitor banding test",
      "color banding test",
      "screen gradient test",
    ],
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
    relatedTests: ["grayscale", "color", "motion"],
    faq: [
      {
        question: "What causes color banding in a smooth gradient?",
        answer:
          "Banding can come from limited bit depth, display processing, GPU output settings, color profiles, or the panel itself. Compression can also add steps to videos and images. This generated gradient removes image compression from the first check, but the rest of the display pipeline still matters.",
      },
      {
        question: "How can I tell monitor banding from video compression?",
        answer:
          "Compare the problem content with this browser-generated gradient. If only one streamed video or compressed image shows bands, the source is the likely cause. If several clean gradients band in the same areas, inspect bit depth, color range, monitor settings, and the panel.",
      },
      {
        question: "Will switching from 8-bit to 10-bit remove banding?",
        answer:
          "It can reduce steps when the operating system, GPU, connection, application, and panel all support the higher-bit path. It will not repair panel uniformity or poor processing. Confirm that the selected resolution and refresh rate still allow the intended color depth.",
      },
      {
        question: "Why do the bands change after I adjust contrast or gamma?",
        answer:
          "Aggressive contrast, black equalizer, gamma, or enhancement settings can crush nearby shades or stretch too few values across a wider range. Resetting to a neutral preset is a useful comparison. Keep the settings that preserve smooth steps without hiding shadow detail.",
      },
      {
        question: "Is a browser gradient banding test fully color-managed?",
        answer:
          "The browser, operating system, GPU, HDR mode, and monitor still influence the output. This page is useful for repeatable visual comparison, not a certified signal-generator measurement. Test another modern browser if one browser produces an unexpected result.",
      },
    ],
  },
  {
    slug: "motion",
    name: "Monitor Ghosting Test",
    shortName: "Motion",
    seoTitle: "Monitor Ghosting Test: Motion Blur and Response Check",
    description:
      "Run a monitor ghosting test at several speeds to check motion blur, dark smearing, bright overdrive trails, frame pacing, and visible response behavior.",
    keywords: [
      "monitor ghosting test",
      "motion blur test",
      "response time test",
      "monitor motion test",
    ],
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
    relatedTests: ["gradient", "grayscale", "guided"],
    faq: [
      {
        question: "What is the difference between ghosting and motion blur?",
        answer:
          "Ghosting is a visible trail caused mainly by pixels taking time to change. Motion blur can also include sample-and-hold blur from tracking a moving object with your eyes. A high refresh rate improves motion clarity, but slow pixel transitions can still leave dark or colored trails.",
      },
      {
        question: "What is inverse ghosting or overdrive overshoot?",
        answer:
          "Inverse ghosting is a bright, dark, or inverted halo created when overdrive pushes pixels past the target value. It often appears after selecting an aggressive response-time mode. A lower overdrive setting may trade a little conventional ghosting for a cleaner trail.",
      },
      {
        question: "Which overdrive setting should I use for this test?",
        answer:
          "Start with the setting you use every day, then compare the next lower and higher modes. Choose the fastest option that does not create distracting halos across your common refresh-rate range. The maximum setting is often tuned for a benchmark rather than the cleanest image.",
      },
      {
        question: "Why does the motion test look choppy in my browser?",
        answer:
          "Confirm the operating system is using the intended refresh rate, close heavy tabs, keep the window on the test monitor, and disable battery-saving limits. Frame pacing from the browser or desktop can look like panel stutter, so repeat the test after reducing system load.",
      },
      {
        question: "Can this page measure a monitor's response time in milliseconds?",
        answer:
          "No. It helps you compare visible trails and settings, but accurate response time requires a photodiode or high-speed capture with controlled transitions. Treat the page as a visual ghosting and motion blur test, not a laboratory response-time result.",
      },
    ],
  },
  {
    slug: "color",
    name: "Monitor Color Test",
    shortName: "Color",
    seoTitle: "Monitor Color Test: Fullscreen RGB and CMY",
    description:
      "Run a monitor color test with fullscreen RGB, cyan, magenta, yellow, black, and white screens to inspect pixels, tint, and color uniformity online.",
    keywords: [
      "monitor color test",
      "RGB screen test",
      "screen color test",
      "display color test",
    ],
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
    relatedTests: ["dead-pixel", "grayscale", "gradient"],
    faq: [
      {
        question: "Why do the same colors look different on two monitors?",
        answer:
          "The displays may use different panel types, color gamuts, presets, white points, brightness levels, HDR modes, or color profiles. Put both in a neutral mode and match brightness first. Exact agreement usually requires measuring and calibrating each screen.",
      },
      {
        question: "Should I turn off Night Light or HDR before an RGB screen test?",
        answer:
          "Turn off Night Light, blue-light filters, and adaptive color for a neutral SDR comparison. Test HDR separately because it changes the rendering path and brightness behavior. There is no single correct mode for every task, so keep notes on which mode you are checking.",
      },
      {
        question: "What do red, green, and blue fullscreen patterns reveal?",
        answer:
          "Primary colors make stuck or missing subpixels easier to isolate. Cyan, magenta, and yellow combine two channels and can reveal tint or channel-specific uniformity. White helps with brightness and tint, while black reveals unwanted light and bright stuck pixels.",
      },
      {
        question: "Can an online monitor color test calibrate my screen?",
        answer:
          "No. Solid colors can reveal visible defects and help compare presets, but they cannot measure white point, gamma, gamut, or color error. Reliable calibration needs a colorimeter and software that creates or applies a measured profile.",
      },
      {
        question: "Can I compare a phone and monitor for exact color accuracy?",
        answer:
          "Not by eye alone. Each device may use a different gamut, brightness, tone mapping, and ambient-light adjustment. You can spot a large tint difference, but an exact comparison needs both devices in controlled modes and measured against the same target.",
      },
    ],
  },
] as const satisfies readonly TestDefinition[];

export function isTestSlug(value: string): value is TestSlug {
  return TEST_SLUGS.includes(value as TestSlug);
}

export function getTestBySlug(slug: string): TestDefinition | undefined {
  return SCREEN_TESTS.find((test) => test.slug === slug);
}
