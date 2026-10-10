import type { Locale } from "@/lib/i18n";
import type { StandaloneToolSlug } from "@/lib/standalone-tools";
import type { TestSlug } from "@/lib/tests";
import { DE_TEST_GUIDANCE } from "@/lib/test-guidance-de";

export type TestGuidanceId = TestSlug | StandaloneToolSlug;

export type TestGuidance = {
  readonly steps: readonly string[];
  readonly normal: readonly string[];
  readonly results: readonly { readonly signal: string; readonly meaning: string }[];
  readonly troubleshooting: readonly string[];
  readonly limitation: string;
};

type GuidanceLabels = {
  readonly navLabel: string;
  readonly how: string;
  readonly normal: string;
  readonly results: string;
  readonly troubleshooting: string;
  readonly normalNote: string;
  readonly home: string;
};

export const GUIDANCE_LABELS = {
  en: {
    navLabel: "Test instructions",
    how: "How to test",
    normal: "What counts as normal",
    results: "How to read your result",
    troubleshooting: "If you cannot get a result",
    normalNote: "Use these references for this visual check. They are not a manufacturer acceptance standard or a hardware certification.",
    home: "Back to home, choose another screen test",
  },
  zh: {
    navLabel: "测试使用说明",
    how: "怎么测",
    normal: "什么算合格",
    results: "结果怎么看",
    troubleshooting: "测不出来怎么办",
    normalNote: "这里的“合格”是本次目视检查的正常参考，不是厂商验收标准，也不是硬件认证。",
    home: "回首页，选择其他屏幕测试",
  },
  de: {
    navLabel: "Testanleitung",
    how: "So testest du",
    normal: "Was als normal gilt",
    results: "So liest du dein Ergebnis",
    troubleshooting: "Wenn du kein Ergebnis bekommst",
    normalNote: "Diese Hinweise gelten für deine Sichtprüfung. Sie sind weder eine Abnahmenorm des Herstellers noch eine Hardwarezertifizierung.",
    home: "Zur Startseite, einen anderen Bildschirmtest wählen",
  },
} as const satisfies Record<Locale, GuidanceLabels>;

const en = {
  guided: {
    steps: [
      "Clean the screen and use your everyday brightness. Choose Enter fullscreen, or press F, to inspect more of the panel.",
      "Use Next or the arrow keys to inspect all six scenes: white, black, RGB, gray, gradient, and motion. Check the center, edges, and corners.",
      "For each scene, select Looks normal, Noticed something, or Skip. At Motion, use Start target if it is paused and follow the moving target with your eyes.",
      "Recording an answer for the sixth scene opens the summary. Review every recorded answer; use the matching single test to check anything suspicious.",
    ],
    normal: [
      "All six scenes were actually inspected and marked Looks normal. You saw no fixed odd pixels, distracting patches, hard gradient bands, or obvious motion trails.",
      "Skip and Not checked mean this pass is incomplete. They do not count as a normal result.",
    ],
    results: [
      { signal: "Nothing obvious showed up", meaning: "You marked all six checks normal. This describes what you observed in this pass, not a complete hardware diagnosis." },
      { signal: "This check is incomplete", meaning: "At least one scene was skipped or left unchecked. Use Run again to inspect them before drawing an overall conclusion." },
      { signal: "One or more checks need a closer look", meaning: "The count is the number of scenes you marked suspicious. Review those scenes and any unfinished checks with their individual tools." },
    ],
    troubleshooting: [
      "If motion is still, select Start target. Reduced-motion settings can leave it paused; a still target cannot check motion trails.",
      "If fullscreen is refused or unsupported, continue in the embedded panel or try the browser fullscreen command. Areas outside the panel remain unchecked.",
      "If a mark is hard to classify, clean the screen, repeat at your normal viewing angle, and open the matching single test. Use Run again for a fresh pass.",
    ],
    limitation: "The browser displays patterns and summarizes your answers. It cannot see the panel, repair faults, or decide return and warranty eligibility. Answers stay in this page.",
  },
  "dead-pixel": {
    steps: [
      "Wipe away dust and use comfortable everyday brightness. Enter fullscreen with the button or F.",
      "Switch manually through white, black, red, green, and blue using the color buttons, Next, or arrow keys. Pause any automatic cycle while inspecting.",
      "Scan the center, all four corners, and edges on each background. Check whether a suspicious dot stays at the exact same position across colors.",
      "Record the position and backgrounds that reveal the dot. Exit fullscreen when you have inspected all five colors.",
    ],
    normal: ["No fixed dot stays dark, bright, or the wrong color across the backgrounds you inspected. A clean result applies only to the visible test area."],
    results: [
      { signal: "A dark dot on light backgrounds", meaning: "A nonresponding pixel or subpixel is possible. Dust or surface damage can look similar, so clean first." },
      { signal: "A bright or colored dot on black", meaning: "A stuck pixel or subpixel is possible. Confirm that it remains fixed when the background changes." },
      { signal: "The mark appears in a screenshot on another display", meaning: "Investigate the app, source image, driver, or operating system. A physical panel fault is not captured in the screenshot itself." },
    ],
    troubleshooting: [
      "Clean gently and repeat the same colors; do not press or rub a suspected pixel.",
      "View a screenshot on a different working screen. A mark absent there is a clue toward this panel or its surface; it is not proof by itself.",
      "If browser controls cover an edge, hide controls with H or try browser fullscreen. Document any area that you could not inspect.",
    ],
    limitation: "This is a visual pixel check. It cannot automatically count defects, fix pixels, or apply the manufacturer's allowable-defect policy.",
  },
  "backlight-bleed": {
    steps: [
      "Dim the room and keep the brightness you use for dark games or films. Sit at your normal distance, facing the center.",
      "Select Enter fullscreen or press F to show the black field. Use Hide controls or H so the toolbar does not light up the edges.",
      "Inspect the edges and corners, then move your head slightly left and right. Note which bright patches stay fixed and which change with your angle.",
      "Compare suspicious patches with a dark scene you normally watch. Restore the controls and exit fullscreen when finished.",
    ],
    normal: ["From your normal seat at everyday brightness, no fixed bright patch distracts you in dark content. A little angle-dependent glow alone does not establish a fault."],
    results: [
      { signal: "A bright edge patch stays put", meaning: "This is consistent with backlight bleed or uneven backlighting. Check whether it also matters in real content." },
      { signal: "The glow changes with your head position", meaning: "Viewing-angle glow may contribute. Retest from the center at your usual distance." },
      { signal: "A photo looks much brighter than the screen", meaning: "Automatic camera exposure can exaggerate the patch. Use your eyes as the first reference." },
    ],
    troubleshooting: [
      "Dim reflections, hide the controls, and repeat at your normal brightness instead of judging only a maximum-brightness photo.",
      "Change your angle and distance slightly. Fixed patches and moving glow give different clues.",
      "If pure black hides the problem, try Grayscale. OLED has no LCD backlight, and near-black unevenness needs a gray pattern.",
    ],
    limitation: "Panel type, room light, local dimming, and viewing angle change the result. This page does not measure contrast or establish a warranty threshold.",
  },
  grayscale: {
    steps: [
      "Let a recently powered-on display warm up. Use normal brightness and sit directly in front of it.",
      "Enter fullscreen with the button or F. Select each gray level: 5%, 10%, 25%, 50%, 75%, and 100%.",
      "At every level, scan the center, edges, and corners for fixed cloudy patches, vertical bands, or large color shifts. Keep your head position steady.",
      "Note the levels and positions that show a problem, then compare with ordinary scenes such as a sky or a camera pan. Exit fullscreen after all six levels.",
    ],
    normal: ["The fields have no obvious fixed clouds, bands, or large tinted areas at the inspected levels. Any faint near-black variation does not distract you in ordinary content."],
    results: [
      { signal: "Cloudy dark patches or fixed bands", meaning: "These suggest uneven brightness, often called dirty screen effect. Check whether they stay at the same position." },
      { signal: "One region looks pink, green, or blue", meaning: "Color uniformity or viewing angle may be involved. Retest with your head centered." },
      { signal: "Only the darkest fields look uneven", meaning: "Near-black behavior varies with the panel and warm-up. One pattern alone does not establish a defect." },
    ],
    troubleshooting: [
      "Wait for the panel to warm up, keep the same brightness and viewing angle, and repeat the affected levels.",
      "Check a plain real scene. Phone exposure, lens shading, and compression can create or exaggerate patches in a photo.",
      "On OLED, allow normal automatic maintenance according to the maker's instructions. Repeated manual refresh is not a test step.",
    ],
    limitation: "This visual check does not measure brightness uniformity. Panel technology, angle, and environment affect what you see.",
  },
  gradient: {
    steps: [
      "Use a neutral display preset and turn off unusual contrast or color enhancements. Keep brightness and display mode fixed during the comparison.",
      "Enter fullscreen, select Neutral, and inspect both Horizontal and Vertical directions.",
      "Repeat with Red, Green, and Blue. Follow each ramp from its dark end to its light end and look for abrupt wide bands or blocks.",
      "Record the channel and direction of any break. Compare once in another browser, then exit fullscreen.",
    ],
    normal: ["Transitions look gradual in both directions, with no abrupt wide stripes, blocks, or sudden color jumps in the inspected channels."],
    results: [
      { signal: "A smooth ramp becomes hard stripes", meaning: "The display path is introducing visible steps. The browser, output depth, processing, or panel may contribute." },
      { signal: "Only one channel shows strong bands", meaning: "A channel-specific setting or panel behavior may contribute. Compare the same channel in another browser." },
      { signal: "Bands change after switching modes", meaning: "The color profile, bit depth, output range, or display enhancement is influencing the gradient." },
    ],
    troubleshooting: [
      "Repeat in another modern browser with the same display settings to check whether rendering changes the bands.",
      "Inspect GPU color depth and output range, system color profile, and HDR/SDR mode. Change one setting at a time.",
      "Turn off aggressive contrast, black equalizer, or color enhancement and compare again. If only a video bands, also check its compression.",
    ],
    limitation: "The page generates gradients without image compression, but the browser and display path still affect them. It does not certify panel bit depth or color accuracy.",
  },
  motion: {
    steps: [
      "Use your everyday refresh rate and overdrive setting. Keep this window on the display you are checking.",
      "The target starts paused at 480 px/s. Select 240 px/s first, then choose Start target; entering fullscreen alone does not start motion.",
      "Follow the target with your eyes and inspect the trailing edge. Compare 480 and 960 px/s using the speed buttons while keeping the other settings fixed.",
      "If comparing overdrive modes, change one display setting at a time and repeat at the same speed. Choose Pause target before finishing.",
    ],
    normal: ["The moving edge has no obvious distracting dark smear or bright inverted halo. Some tracking blur can remain even on a working display."],
    results: [
      { signal: "A dark tail follows the target", meaning: "Slow pixel transitions may cause smearing. Compare a different overdrive setting at the same speed." },
      { signal: "A bright or inverted outline follows it", meaning: "Overdrive may overshoot. A less aggressive response setting can make the edge cleaner." },
      { signal: "The whole target jumps or pauses", meaning: "Browser frame timing, system load, or refresh configuration may cause stutter. This differs from a trail behind an edge." },
    ],
    troubleshooting: [
      "If nothing moves, select a speed and Start target. A background tab or reduced-motion preference can leave motion paused.",
      "Close heavy tabs and apps, keep the page in the foreground, and check the system's selected refresh rate and power-saving mode.",
      "Repeat at 240 px/s before faster speeds. Compare the same display setting and speed so a change has a clear cause.",
    ],
    limitation: "This is a visual comparison of motion behavior, not a measurement of response time in milliseconds, input lag, or hardware refresh rate.",
  },
  color: {
    steps: [
      "Turn off Night Light, blue-light filters, and adaptive color for a neutral comparison. Use normal brightness.",
      "Enter fullscreen and manually select white, black, red, green, blue, cyan, magenta, and yellow. Use Next or arrow keys to change colors.",
      "Inspect the center and edges of each field for fixed odd dots or regions with a different tint. Compare areas within this screen first.",
      "Automatic cycling is optional; pause it to examine a mark. Record which colors reveal the mark and exit fullscreen after all eight fields.",
    ],
    normal: ["Each solid field looks consistent across the visible area, with no fixed wrong-color pixels or large unexpected tinted patches."],
    results: [
      { signal: "A dot refuses to match its background", meaning: "A stuck or missing subpixel is possible. Confirm with the Dead pixel test and a clean screen." },
      { signal: "A solid field looks blotchy", meaning: "Brightness or color uniformity may vary. Compare different colors and the Grayscale test." },
      { signal: "A phone and monitor show different colors", meaning: "Presets, brightness, white point, color gamut, and profiles differ. A mismatch alone does not mean either panel has failed." },
    ],
    troubleshooting: [
      "Disable night and adaptive-color modes, then repeat in a neutral preset at fixed brightness.",
      "If comparing two devices, match their mode and approximate brightness first. Do not treat an uncalibrated device as an exact reference.",
      "Pause the automatic cycle and inspect each field manually. If a mark remains unclear, clean the screen and compare another browser.",
    ],
    limitation: "Solid colors reveal visible differences. They do not measure color error, white point, gamut coverage, or create a calibrated color profile.",
  },
  "touch-screen-test": {
    steps: [
      "Clean and dry the screen and your fingers. On a touch device, choose Start Touch Test; a mouse only previews the grid.",
      "Before filling the grid, move two or more fingers at the same time to record the peak. The live counters are visible in page mode; fullscreen hides them. Read Observed peak inputs in the result afterwards.",
      "Then drag one finger slowly through the remaining cells, including all four corners and edges. Keep the area the same size and repeat any blank region slowly.",
      "Full coverage ends the test automatically. To finish sooner, exit fullscreen with Esc or hold the grid's top-right exit area for about one second, then choose Finish.",
      "Review the frozen map and observed peak. Use Download Result to keep the map; Test Again starts a new pass.",
    ],
    normal: [
      "This pass covers the whole test grid without a repeatable blank region or unexplained jumps in the finger path.",
      "Observed peak inputs is the greatest simultaneous input count the browser observed in this pass. It does not prove the device's maximum touch capacity; mouse coverage is only a preview.",
    ],
    results: [
      { signal: "100% coverage", meaning: "The recorded path covers the whole test grid in this pass, including cells between observed input points. It does not certify the touch controller or areas outside the grid." },
      { signal: "The same connected region stays blank", meaning: "A touch dead zone is possible. A missed path, screen protector, edge gesture, or browser behavior can also leave cells blank." },
      { signal: "Paths jump or fewer contacts appear", meaning: "Moisture, charging interference, touch limits, or browser event handling may contribute. Peak is an observation, not a specification." },
    ],
    troubleshooting: [
      "If using a mouse, repeat on the actual touch device with fingers before judging touch hardware.",
      "Clean and dry the surface, unplug the charger, and remove an interfering case or protector if practical. Repeat the same blank region slowly.",
      "If the area changes size or the phone rotates, restart for a consistent grid. If fullscreen fails, test here and note that only this region is covered.",
    ],
    limitation: "The page records only input events the browser receives. It cannot read controller firmware, guarantee sampling precision, or certify touch hardware from one complete map.",
  },
  "hdr-test": {
    steps: [
      "Move the window to the display you want to check. If checking HDR, enable it in the operating system and keep the display mode fixed.",
      "Select Detection to read the browser's dynamic-range and color-gamut reports. Note HDR capable, SDR reported, or Query unavailable.",
      "Switch to Dynamic range and inspect dark fields, white steps, and the small bright area. Then select Wide gamut and compare its color columns.",
      "Use the mode buttons or arrow keys; fullscreen is optional. Record the browser, display mode, and visible differences before exiting.",
    ],
    normal: [
      "Read the capability report and complete the visual checks. A useful visual reference is no unexpected merging of steps or distracting halo in the inspected fields.",
      "There is no page-wide HDR pass score. SDR or an unavailable query is inconclusive for hardware health; a high capability signal does not confirm that HDR is currently enabled.",
    ],
    results: [
      { signal: "HDR capable / high dynamic range reported", meaning: "The browser reports a high-dynamic-range capability signal. It does not confirm HDR is currently enabled, establish peak brightness, or certify the display." },
      { signal: "SDR reported or Query unavailable", meaning: "The current path does not report high dynamic range, or the query is unavailable. This alone does not establish a hardware fault." },
      { signal: "Dark or bright steps merge; a bright patch has a halo", meaning: "Contrast settings, tone mapping, or local dimming can affect these visual fields. The pattern is not a calibrated HDR luminance measurement." },
      { signal: "Wide-gamut columns look identical", meaning: "Browser support, the system profile, and display mapping may make them look alike. Identical columns do not prove a narrow-gamut panel." },
    ],
    troubleshooting: [
      "Check system HDR, the selected display, its preset, and the GPU output path. Reopen the page after changing the mode.",
      "Try another modern browser on the same display. An unavailable browser query is a compatibility result, not a failed panel.",
      "Keep brightness and room light steady for comparisons. Use a known HDR application for a second check of the actual HDR content path.",
    ],
    limitation: "These browser-drawn fields are not calibrated PQ or HLG HDR signals. The page cannot measure nits, native panel bit depth, contrast, HDR formats, or certification.",
  },
  "screen-tearing-test": {
    steps: [
      "Use your normal resolution and refresh rate, keep browser zoom fixed, and move the window to the test display.",
      "Choose Stripe Tracking and a speed: Slow 240, Medium 520, or Fast 960 px/s. Use Play if the pattern is paused; the fullscreen button alone does not start it.",
      "Watch sharp moving edges for a horizontal break. Repeat with Block Layers and Checker Scroll at the same speed.",
      "Compare one sync or frame-limit setting at a time. Choose Pause after each observation and repeat the relevant setting in the game where you see the problem.",
    ],
    normal: ["During this browser pass, moving patterns have no visible horizontal displacement between their upper and lower regions. This does not prove that games use the same sync path."],
    results: [
      { signal: "A horizontal split offsets part of the image", meaning: "That is consistent with tearing: different screen regions show different moments." },
      { signal: "The entire pattern jumps or stops together", meaning: "This looks more like stutter or uneven frame timing than tearing." },
      { signal: "An edge leaves a dark trail or bright halo", meaning: "That points toward ghosting or overdrive. Use the Motion test to compare it." },
      { signal: "The browser frame number differs from monitor Hz", meaning: "The number estimates animation callbacks. It is not a hardware refresh-rate reading or a VRR certificate." },
    ],
    troubleshooting: [
      "Choose Play if nothing moves. Returning from a hidden tab or a reduced-motion preference can leave the pattern paused.",
      "Close heavy tasks and keep the page in the foreground. Retest the same pattern and speed before blaming the panel.",
      "If the browser is smooth but a game tears, check VSync, FreeSync/G-Sync, and frame limits inside that game and its driver settings.",
    ],
    limitation: "The browser usually synchronizes composition. This page cannot turn VSync off, certify VRR operation, or reproduce every game's fullscreen and presentation behavior.",
  },
  "monitor-color-calibration": {
    steps: [
      "Warm up the display for about 20 minutes. For an SDR check, disable HDR, night mode, and dynamic contrast; set browser zoom to 100%.",
      "Select Black & White Levels. Use the monitor's own settings to compare the 0–5% dark fields and 95–100% light fields; avoid losing nearby steps.",
      "Choose Neutral Grayscale and look for tint. At Gamma 2.2, step back until the checker blends and compare it with the adjacent gray as a rough visual reference.",
      "Use Color Separation to inspect the color fields. Change just one monitor setting at a time, record its original value, and finish by checking ordinary photos or video.",
    ],
    normal: [
      "Near-black and near-white fields remain distinguishable where your display and environment allow, gray looks neutral, and color fields remain distinct.",
      "The checker and adjacent gray look roughly similar after they blend. This is a visual guide, not proof that measured gamma equals 2.2.",
    ],
    results: [
      { signal: "Dark steps disappear into black", meaning: "Black level, output range, or contrast processing may crush shadow detail." },
      { signal: "Light steps merge into white", meaning: "Excess contrast or other processing may clip highlights. Recheck after changing one setting." },
      { signal: "Gray has a color tint", meaning: "White balance, color temperature, or a night filter may shift neutral tones." },
      { signal: "The two gamma reference areas differ", meaning: "Display response and browser rendering may differ from this reference. Do not infer an exact gamma value from this comparison." },
    ],
    troubleshooting: [
      "Return to a neutral SDR preset, confirm 100% browser zoom, and compare before making several changes.",
      "Change one monitor setting at a time and keep notes. If the result worsens, restore that value before moving on.",
      "For accurate color work, use a colorimeter or spectrophotometer and measured calibration software. A browser field cannot replace light measurements.",
    ],
    limitation: "The page guides visual adjustments. It does not measure gamma, white point, color error, or gamut, and it does not create an ICC profile.",
  },
  "black-level-test": {
    steps: [
      "Use SDR, normal brightness, and 100% browser zoom. Dim reflections and keep night mode and dynamic contrast off.",
      "Enter fullscreen, choose Pure black, hide controls, and let your eyes adapt for about 30 seconds. Inspect it from your usual seat for raised black or fixed bright regions.",
      "Switch to Near-black 1-10 and record which RGB 1–10 fields you can reliably separate from black. These are integer RGB values, not percentages.",
      "Choose Black depth and inspect the embedded dark fields and fine stripes. Compare local dimming on and off if available, then exit fullscreen and record the setting used.",
    ],
    normal: ["Use stable separation of dark fields as a relative reference between settings. There is no universal required count of visible RGB 1–10 fields; the room and panel matter."],
    results: [
      { signal: "All near-black fields disappear", meaning: "Black level, gamma, mismatched output range, or the panel's near-black limits may hide detail." },
      { signal: "Pure black looks gray", meaning: "Reflections, an output-range mismatch, or the panel's native black level may raise it." },
      { signal: "Dark blocks show but fine stripes disappear", meaning: "Processing or local dimming may remove very dark fine detail. Compare with one setting changed." },
    ],
    troubleshooting: [
      "Reduce reflections and repeat at the same seating position and brightness. Do not change the room and display settings together.",
      "Check that the GPU and display agree on Full 0–255 or Limited 16–235 output. A mismatch can lift black or swallow shadows.",
      "Compare local dimming and contrast enhancements one at a time. If details remain unclear, note the lowest consistently visible value rather than inventing a pass count.",
    ],
    limitation: "These fixed SDR RGB patterns do not measure black luminance, contrast, nits, or panel type. Results support comparison rather than a universal acceptance score.",
  },
  "oled-burn-in-test": {
    steps: [
      "Show normal moving content for a few minutes, use everyday brightness, and dim the room. Do not use a long static pattern as a repair attempt.",
      "Enter fullscreen and select Solid color cycle. Inspect gray, red, green, blue, white, and black for fixed logos, taskbars, or window outlines.",
      "Choose Low-gray uniformity and compare the actual 5%, 10%, 20%, 30%, and 50% levels. Then inspect Moving color bars and Gradient sweep if useful.",
      "Use Play for changing patterns. Selecting a manual color or gray sample pauses it. Continuous playback stops after five minutes and shows black; a manually paused static sample has no such timer protection, so exit it promptly.",
      "Record any fixed outline and return to ordinary content. Recheck after normal use or rest instead of leaving this pattern up.",
    ],
    normal: ["No fixed logo or interface outline appears across several colors and ordinary content. A faint dark-gray band by itself does not establish permanent burn-in."],
    results: [
      { signal: "An outline repeats at the same position across colors", meaning: "Image retention or uneven wear is possible. A single observation cannot tell whether it is permanent." },
      { signal: "Gray shows bands or cloudy areas", meaning: "Near-black uniformity may vary without a recognizable retained image. Compare the Grayscale test and real content." },
      { signal: "The outline fades after ordinary content or rest", meaning: "That is more consistent with temporary retention. Record how it changes across later checks." },
    ],
    troubleshooting: [
      "Confirm the mark repeats across multiple colors and real content, then recheck after normal use or rest.",
      "If the pattern is still, choose Play for cycling; manual color or gray selection pauses playback. Finish static inspection promptly because the playback timer is inactive while paused.",
      "Follow the manufacturer's routine maintenance instructions. Do not repeatedly run deep pixel refresh or prolonged static patterns to chase one test image.",
    ],
    limitation: "The page cannot measure pixel aging, confirm permanent burn-in in one pass, or determine warranty eligibility. The five-minute stop applies to continuous playback, not paused static inspection.",
  },
  "screen-resolution-checker": {
    steps: [
      "Move the window to the intended display and set browser page zoom to 100%. Wait for the live measurements to settle.",
      "Compare Reported screen with Layout viewport and Visible viewport. The screen and viewport values use CSS pixels; the viewport describes browser content space.",
      "Read Pixel ratio and Estimated output pixels together. The estimate multiplies reported screen size by DPR; DPR depends on system scale and browser page zoom.",
      "Resize the window, enter fullscreen, or rotate the phone and watch the viewport update. Record the values with zoom and system scale, then compare with system display settings and the monitor menu.",
    ],
    normal: ["Live values react to window or orientation changes. A smaller CSS screen size or viewport can be expected with scaling and browser controls; it does not by itself mean missing physical pixels."],
    results: [
      { signal: "Reported screen is smaller than the panel specification", meaning: "CSS pixels and system scaling can explain this. For example, a 4K output at 200% scale may report about 1920 × 1080 CSS pixels." },
      { signal: "The viewport is smaller than the screen", meaning: "Window size, browser bars, sidebars, and system UI reduce the content area." },
      { signal: "DPR or estimated output changes with zoom", meaning: "Page zoom can change DPR, so the calculated output remains an estimate. Pinch zoom usually changes the visible viewport scale instead." },
      { signal: "Frame cadence or color buffer looks unexpected", meaning: "Cadence estimates browser callbacks, not display Hz. Color buffer is a browser value, not proof of native panel bit depth." },
    ],
    troubleshooting: [
      "Restore 100% page zoom and keep the window on one display. Compare again after the values settle.",
      "Check actual resolution and scaling in system settings and the display's own menu. Use those to verify output rather than the estimated pixel label alone.",
      "If a field says Not reported or Not supported, try another browser. Keep this tab visible for frame timing; an unavailable API is not a hardware failure.",
    ],
    limitation: "Browser APIs do not reliably reveal the physical panel resolution, EDID model, physical pixel density, or real refresh rate. Estimated output pixels are a calculation, not a direct hardware measurement.",
  },
} as const satisfies Record<TestGuidanceId, TestGuidance>;

const zh = {
  guided: {
    steps: [
      "先擦干净屏幕，使用日常亮度。点“进入全屏”或按 F，让更多屏幕区域进入检查画面。",
      "用“下一项”或方向键依次查看白色、黑色、RGB、灰色、渐变、动态六个画面。每项都看中心、边缘和四角。",
      "每项选择“看起来正常”“发现异常”或“跳过”。动态项若暂停，先点“启动目标”，再用眼睛跟随目标观察拖影。",
      "记录第六项答案后，工具会显示总结。逐项核对答案；可疑现象再用对应的单项工具复查。",
    ],
    normal: [
      "六项都实际检查，并记录为“看起来正常”。没有固定异常像素、干扰观看的斑块、明显渐变断层或动态拖尾。",
      "“跳过”和“未检查”说明本轮尚未完成，不计入正常结果。",
    ],
    results: [
      { signal: "没有发现明显问题", meaning: "你把六项都记录为正常。这描述本轮观察，不代表完整硬件诊断。" },
      { signal: "本次检查未完成", meaning: "至少有一项跳过或未检查。用“重新测试”补测这些项目后，再判断整轮结果。" },
      { signal: "有若干项需要仔细复查", meaning: "数字是你标记异常的项目数。用对应单项工具检查这些现象，也补测尚未检查的项目。" },
    ],
    troubleshooting: [
      "动态画面不动时，点“启动目标”。减少动态效果设置可能让它保持暂停；静止目标无法检查动态拖影。",
      "全屏遭拒或浏览器不支持时，可继续检查页面内区域，或使用浏览器自带全屏。区域外的屏幕仍未检查。",
      "难以判断痕迹时，清洁屏幕、固定日常视角，再打开对应单项测试。“重新测试”会开启新一轮检查。",
    ],
    limitation: "浏览器只展示图案并汇总你的答案。它看不到面板内部，不能修复故障或判断退换与保修资格。答案留在当前页面。",
  },
  "dead-pixel": {
    steps: [
      "擦掉灰尘和油点，使用舒适的日常亮度。点“进入全屏”或按 F。",
      "用颜色按钮、“下一项”或方向键，手动检查白、黑、红、绿、蓝。观察可疑小点时，先暂停自动切换。",
      "每个背景都扫描中心、四角和边缘。确认可疑小点是否在不同颜色下始终停在同一位置。",
      "记下位置和能显出异常的背景。五种颜色都检查后，退出全屏结束本轮。",
    ],
    normal: ["检查过的多种背景中，没有固定小点持续发暗、发亮或显示错误颜色。这个参考只适用于可见测试区域。"],
    results: [
      { signal: "浅色背景上有固定暗点", meaning: "可能是像素或子像素不响应。灰尘、划痕也可能很像，先清洁再确认。" },
      { signal: "黑色背景上有亮点或彩色点", meaning: "可能是卡住的像素或子像素。换背景后位置不变，才值得进一步排查。" },
      { signal: "另一块屏幕也能看到截图里的痕迹", meaning: "优先排查应用、原图、驱动或系统。截图记录输出图像，不会把物理面板坏点拍进去。" },
    ],
    troubleshooting: [
      "轻柔清洁后再看同样的颜色。不要按压或摩擦疑似坏点。",
      "把截图放到另一块正常屏幕查看。痕迹在那里消失，说明这块面板或表面更值得检查，但不能只凭这一点定论。",
      "浏览器或控制栏遮住边缘时，按 H 隐藏控制栏，或使用浏览器全屏。记下无法查看的区域。",
    ],
    limitation: "这是目视像素检查。网页不会自动数坏点、修复像素，也不能替代厂商的坏点验收政策。",
  },
  "backlight-bleed": {
    steps: [
      "调暗房间，保持看暗场游戏或电影时的日常亮度。坐在平时的距离，正对屏幕中心。",
      "点“进入全屏”或按 F 显示黑色画面。点“隐藏控制栏”或按 H，避免亮控制栏影响边缘观察。",
      "检查边缘和四角，再轻微左右移动头部。记下哪些亮斑固定，哪些会随视角变化。",
      "找一段平时会看的暗场内容，确认亮斑是否干扰观看。完成后恢复控制栏并退出全屏。",
    ],
    normal: ["日常亮度和观看位置下，没有干扰暗场内容的固定亮斑。少量随视角变化的泛光本身不能确认故障。"],
    results: [
      { signal: "边缘亮斑固定不动", meaning: "可能与漏光或背光不均有关。还要确认它在真实内容里是否明显。" },
      { signal: "移动头部时泛光变化", meaning: "视角泛光可能参与其中。回到屏幕正中、日常距离再测。" },
      { signal: "手机照片比肉眼严重很多", meaning: "自动曝光可能夸大暗场亮斑。先以日常位置的肉眼观察为参考。" },
    ],
    troubleshooting: [
      "减少环境反射、隐藏控制栏，在日常亮度重测。不要只凭最高亮度照片判断。",
      "轻微改变角度和距离，分清固定亮斑与跟着视角变化的泛光。",
      "纯黑看不出问题时，试灰阶测试。OLED 没有 LCD 背光，近黑不均往往需要灰色图案才容易看见。",
    ],
    limitation: "面板类型、环境光、局部调光和视角都会改变观感。网页不测量对比度，也不设保修合格线。",
  },
  grayscale: {
    steps: [
      "刚开机的屏幕先预热，使用日常亮度，坐在屏幕正前方。",
      "点“进入全屏”或按 F，依次选择 5%、10%、25%、50%、75%、100% 灰阶。",
      "每档都扫描中心、边缘和四角，找固定云斑、竖条或大片偏色。保持头部位置不变。",
      "记下问题出现的档位和位置，再用天空、镜头平移等日常画面确认影响。六档看完后退出全屏。",
    ],
    normal: ["各档没有明显固定云斑、条带或大片偏色。若极暗灰阶有轻微差异，它在日常内容中也不应持续干扰观看。"],
    results: [
      { signal: "灰色上有云状暗斑或固定条带", meaning: "可能是亮度均匀性差异，也常叫脏屏效应。确认它是否总在同一位置。" },
      { signal: "某块区域偏粉、偏绿或偏蓝", meaning: "色彩均匀性或视角可能影响观感。正对屏幕重测一次。" },
      { signal: "只有最暗灰阶不均匀", meaning: "近黑表现会随面板和预热状态变化。单张图案不能直接确认缺陷。" },
    ],
    troubleshooting: [
      "预热后，保持同样亮度和视角，再看异常档位。",
      "用真实的平坦画面复查。手机自动曝光、镜头暗角或压缩都可能让照片多出斑块。",
      "OLED 按厂商说明完成日常自动维护即可，不要把反复手动刷新当作测试步骤。",
    ],
    limitation: "这是目视均匀性检查，不会测量亮度分布。面板技术、视角和环境都会影响结果。",
  },
  gradient: {
    steps: [
      "选择中性显示预设，关闭激进的对比度或色彩增强。比较期间保持亮度和显示模式不变。",
      "进入全屏，选择“中性”通道，分别查看“水平”和“垂直”方向。",
      "再检查红色、绿色、蓝色通道。从暗端看到亮端，找突兀的宽条、色块或颜色跳变。",
      "记下异常通道与方向，用另一浏览器对照一次，然后退出全屏。",
    ],
    normal: ["两个方向的过渡都平顺，检查过的通道里没有突兀宽条、色块或明显颜色断层。"],
    results: [
      { signal: "平滑渐变变成硬条纹", meaning: "显示链路出现可见阶梯。浏览器、输出位深、图像处理或面板都可能参与。" },
      { signal: "只有一种颜色出现强色带", meaning: "可能与该通道的设置或面板表现有关。换浏览器后检查同一通道。" },
      { signal: "切换显示模式后条纹变化", meaning: "色彩配置、位深、输出范围或显示器增强功能会影响渐变。" },
    ],
    troubleshooting: [
      "保持同一显示设置，用另一款现代浏览器重测，确认渲染是否改变色带。",
      "检查显卡色深、输出范围、系统色彩配置以及 HDR/SDR 模式。每次只改一项。",
      "关闭激进对比度、黑色增强或色彩增强再比较。如果只有某段视频有色带，也检查源文件压缩。",
    ],
    limitation: "网页直接生成渐变，避开图片压缩，但浏览器和显示链路仍会影响图案。它不能认证面板位深或色准。",
  },
  motion: {
    steps: [
      "使用日常刷新率和过驱设置，把窗口放在要测的显示器上。",
      "目标初始暂停，速度为 480 像素/秒。先选择 240 像素/秒，再点“启动目标”；进入全屏不会自动播放。",
      "用眼睛跟随目标，观察后缘。保持其他设置不变，再用速度按钮对比 480 和 960 像素/秒。",
      "比较过驱档位时，每次只改一个显示器选项，并使用同一速度。结束前点“暂停目标”。",
    ],
    normal: ["移动边缘没有明显干扰观看的暗尾或反色光晕。正常屏幕也可能有一定跟随模糊。"],
    results: [
      { signal: "目标后面有暗色长尾", meaning: "像素切换较慢可能带来暗色拖影。用同一速度比较其他过驱档位。" },
      { signal: "目标后面有亮边或反色轮廓", meaning: "过驱可能过冲。降低响应速度档位，有时能换来更干净的边缘。" },
      { signal: "整个目标一起跳动或停顿", meaning: "浏览器帧时序、系统负载或刷新率设置可能引起卡顿。这和边缘后面的拖尾不同。" },
    ],
    troubleshooting: [
      "没有运动时，明确选择速度并点“启动目标”。切到后台或减少动态效果设置都可能让目标暂停。",
      "关闭高负载标签页和应用，保持页面前台，并检查系统刷新率及省电设置。",
      "先在 240 像素/秒重测，再加速。比较时固定显示设置和速度，才能看清哪项调整起作用。",
    ],
    limitation: "这是动态表现的目视比较，不测毫秒响应时间、输入延迟或硬件刷新率。",
  },
  color: {
    steps: [
      "要做中性色彩比较时，关闭夜间模式、蓝光滤镜和自适应色彩，使用日常亮度。",
      "进入全屏，手动检查白、黑、红、绿、蓝、青、品红、黄。用颜色按钮、“下一项”或方向键切换。",
      "每个画面都看中心和边缘，找固定异常小点或局部偏色。先比较这块屏幕内的不同区域。",
      "自动切换可选，细看痕迹时先暂停。记下哪些颜色显出异常，八种颜色看完后退出全屏。",
    ],
    normal: ["同色画面在可见区域内保持一致，没有固定错误颜色的像素或大片异常偏色。"],
    results: [
      { signal: "某个小点总与背景不同色", meaning: "可能是卡住或失效的子像素。清洁屏幕后，用坏点测试确认。" },
      { signal: "纯色画面发花或局部变色", meaning: "可能有亮度或色彩均匀性差异。换颜色并用灰阶测试复查。" },
      { signal: "手机和显示器颜色不同", meaning: "预设、亮度、白点、色域和色彩配置可能不同。单凭不一致，不能判定哪块屏幕损坏。" },
    ],
    troubleshooting: [
      "关闭夜间和自适应色彩，在中性预设、固定亮度下重测。",
      "比较两台设备时，先尽量统一模式和亮度。未经校准的设备不能当作精确参考。",
      "暂停自动切换，逐色检查。痕迹不明确时，清洁屏幕并换浏览器比较。",
    ],
    limitation: "纯色能显出可见差异，但不能测色差、白点、色域覆盖，也不能生成校准配置。",
  },
  "touch-screen-test": {
    steps: [
      "擦干净并擦干屏幕和手指。在触控设备上点“开始触摸测试”；鼠标只用于预览网格。",
      "先在未划满网格时，同时移动两根或更多手指，记录峰值。页面内模式能看实时指标，全屏会隐藏它们；结束后再看“本轮观测峰值”。",
      "再用一根手指慢慢划过剩余格子，包括四角和边缘。本轮保持区域尺寸不变，空白区域再慢速划一次。",
      "覆盖完整后，测试会自动结束。想提前结束时，先按 Esc 或按住网格右上角退出区域约一秒退出全屏，再点“完成”。",
      "查看冻结的地图和本轮峰值。用“下载结果”保存地图；“再次测试”会开启新一轮。",
    ],
    normal: [
      "本轮测试区域覆盖完整，没有反复出现的固定空白，也没有手指轨迹的异常跳动。",
      "峰值是本轮浏览器实际观测到的最多同时触点，不代表设备最大能力；鼠标覆盖只算预览。",
    ],
    results: [
      { signal: "覆盖率 100%", meaning: "本轮记录的路径已覆盖整个测试网格，包括观测输入点之间的路径格子。它不认证触控控制器，也不包含网格外区域。" },
      { signal: "同一片连续区域反复留白", meaning: "可能是触控死区，也可能只是漏划、保护膜、边缘手势或浏览器行为。" },
      { signal: "轨迹乱跳，或识别的手指数较少", meaning: "水分、充电干扰、触点上限或事件处理都可能参与。峰值是本次观察，不是设备规格。" },
    ],
    troubleshooting: [
      "若使用鼠标，请到真正的触控设备上用手指重测，再判断触控硬件。",
      "清洁并擦干表面，拔掉充电器；条件允许时去掉干扰的外壳或保护膜。在同一空白区域慢划复查。",
      "区域尺寸变化或手机旋转后，重新开始，确保使用同一网格。全屏失败可在页面内测试，并记录覆盖区域范围。",
    ],
    limitation: "网页只记录浏览器收到的输入事件，不能读取触控固件、保证采样精度，也不能用一次完整地图认证触控硬件。",
  },
  "hdr-test": {
    steps: [
      "把窗口移到要测的显示器。检查 HDR 时，先在系统开启 HDR，比较期间保持显示模式不变。",
      "选择“环境检测”，读取浏览器动态范围和色域报告。记下“检测到 HDR”“当前报告为 SDR”或“浏览器无法查询”。",
      "切到“动态范围”，观察暗部、白阶和小亮区；再选“广色域”，比较不同颜色列。",
      "用模式按钮或方向键切换，全屏可选。记下浏览器、显示模式和可见差异，然后退出。",
    ],
    normal: [
      "先读取能力报告，再完成目视观察。检查过的图案没有意外的大量阶梯合并或干扰观看的光晕，可作本轮视觉参考。",
      "这里没有整页 HDR 通过分数。SDR 或无法查询不能确定硬件好坏；高动态范围能力信号也不证明 HDR 当前已经开启。",
    ],
    results: [
      { signal: "检测到 HDR／报告为高动态范围", meaning: "浏览器报告高动态范围能力信号，不证明 HDR 当前已经开启，也不代表已测峰值亮度或获得 HDR 认证。" },
      { signal: "报告为 SDR 或无法查询", meaning: "当前链路没有报告高动态范围，或查询不可用。单凭这项不能判断硬件故障。" },
      { signal: "暗阶或白阶合并，小亮区周围有光圈", meaning: "对比度、色调映射或局部调光可能影响视觉图案。它不是经过校准的 HDR 亮度测量。" },
      { signal: "广色域的颜色列看起来一样", meaning: "浏览器支持、系统配置与显示映射都可能让颜色接近，不能因此确认面板是窄色域。" },
    ],
    troubleshooting: [
      "确认系统 HDR、当前显示器、显示预设和显卡输出链路。切换模式后重新打开页面。",
      "在同一显示器上换现代浏览器试一次。查询不可用属于兼容性结果，不等于面板失败。",
      "比较时固定亮度和环境光，再用已知 HDR 应用复查真正的 HDR 内容链路。",
    ],
    limitation: "这些浏览器图案不是经过校准的 PQ 或 HLG HDR 信号。网页不能测尼特、面板原生位深、对比度、HDR 格式或认证。",
  },
  "screen-tearing-test": {
    steps: [
      "使用日常分辨率和刷新率，保持浏览器缩放不变，把窗口放到要测的显示器。",
      "选择“条纹追踪”以及慢速 240、中速 520 或快速 960 像素/秒。若图案暂停，点“播放”；全屏按钮本身不会播放。",
      "观察锐利移动边缘是否出现横向断层。再用同一速度检查“分层方块”和“滚动棋盘格”。",
      "每次只改一项同步或帧率限制设置。观察结束点“暂停”，并在真正出问题的游戏里复查对应设置。",
    ],
    normal: ["本轮浏览器检查里，移动图案的上下区域没有可见横向错位。这不代表游戏使用相同的同步链路。"],
    results: [
      { signal: "横向断层让上下画面错位", meaning: "这更接近撕裂：屏幕不同区域显示了不同时刻的画面。" },
      { signal: "整个图案一起跳动或停顿", meaning: "这更像卡顿或帧时序不稳定，和撕裂不同。" },
      { signal: "移动边缘留下暗尾或亮边", meaning: "更像拖影或过驱过冲，可用动态拖影测试进一步比较。" },
      { signal: "浏览器帧率和显示器 Hz 不同", meaning: "页面数字估算动画回调频率，不是硬件刷新率读数，也不是可变刷新率认证。" },
    ],
    troubleshooting: [
      "画面不动就点“播放”。返回后台标签页，或设备开启减少动态效果后，图案可能保持暂停。",
      "关闭高负载任务并保持页面前台，先在同一图案、同一速度下复测。",
      "浏览器流畅但游戏撕裂时，在游戏和驱动设置里检查 VSync、FreeSync/G-Sync 与帧率上限。",
    ],
    limitation: "浏览器通常会同步页面合成。网页不能关闭 VSync、认证可变刷新率工作状态，也无法复现每款游戏的全屏与画面提交方式。",
  },
  "monitor-color-calibration": {
    steps: [
      "让屏幕预热约 20 分钟。检查 SDR 时，关闭 HDR、夜间模式和动态对比度，并把浏览器缩放设为 100%。",
      "选择“黑白电平”，用显示器菜单调整，比较 0–5% 暗阶和 95–100% 白阶，尽量保留相邻档位。",
      "选“中性灰阶”检查偏色；在“Gamma 2.2”里向后退到棋盘格混合，和相邻灰色做粗略目视比较。",
      "用“色彩分离”检查色块。每次只改一个显示器选项，记下原值；最后用普通照片或视频确认观感。",
    ],
    normal: [
      "在屏幕和环境允许的范围内，近黑与近白保留可分辨的阶梯，灰色保持中性，各颜色仍能清楚区分。",
      "棋盘格混合后与相邻灰色大致接近。这只作视觉参考，不能证明实测 Gamma 等于 2.2。",
    ],
    results: [
      { signal: "暗阶全融入黑色", meaning: "黑位、输出范围或对比度处理可能压掉暗部细节。" },
      { signal: "白阶全融入纯白", meaning: "过高对比度或其他处理可能截断高光。每改一项就重新看一次。" },
      { signal: "灰阶带有红绿蓝偏色", meaning: "白平衡、色温或夜间滤镜可能让中性色偏移。" },
      { signal: "两块 Gamma 参考区亮度不同", meaning: "显示响应和浏览器渲染可能偏离参考。不要仅凭这张图推出精确 Gamma 数值。" },
    ],
    troubleshooting: [
      "先恢复中性 SDR 预设，确认浏览器 100% 缩放，再比较，避免一次改动多项。",
      "每次只改一个显示器设置并记录。结果更差时先恢复原值，再检查下一项。",
      "精确色彩工作需要色度计或分光仪及测量校准软件。浏览器色块无法替代光学测量。",
    ],
    limitation: "网页指导目视调整，不测 Gamma、白点、色差或色域，也不生成 ICC 配置。",
  },
  "black-level-test": {
    steps: [
      "使用 SDR、日常亮度与 100% 浏览器缩放，减少环境反射，关闭夜间模式和动态对比度。",
      "进入全屏，选择“纯黑均匀性”，隐藏控制栏并等待眼睛适应约 30 秒。在日常位置找灰黑或固定亮区。",
      "切到“近黑阶 1-10”，记下能稳定与黑色区分的 RGB 1–10 色块。这里是 RGB 整数值，不是百分比。",
      "选择“黑位深度”，检查嵌入暗块和细横纹。有局部调光时可分别开关比较，最后退出全屏并记录使用的设置。",
    ],
    normal: ["以稳定可见的暗阶作为不同设置间的相对参考。没有统一要求必须看见多少个 RGB 1–10 色块；环境和面板都会影响结果。"],
    results: [
      { signal: "所有近黑色块都消失", meaning: "黑位、Gamma、输出范围不匹配，或面板的近黑能力可能隐藏细节。" },
      { signal: "纯黑整体发灰", meaning: "环境反射、输出范围不匹配或面板原生黑位可能抬高黑色。" },
      { signal: "暗块可见，细横纹却消失", meaning: "图像处理或局部调光可能抹掉极暗细节。每次只改一项再比较。" },
    ],
    troubleshooting: [
      "减少反射，在同一坐姿和亮度重测。不要同时改变环境光与显示设置。",
      "确认显卡与显示器采用匹配的 Full 0–255 或 Limited 16–235 范围。错误组合可能抬黑或吞掉暗部。",
      "逐项对比局部调光和对比度增强。仍难判断时，记录最低稳定可见值，不要编造统一通过格数。",
    ],
    limitation: "固定 SDR RGB 图案不测黑色亮度、对比度、尼特或面板类型。结果适合比较设置，不是统一验收分数。",
  },
  "oled-burn-in-test": {
    steps: [
      "先播放几分钟普通动态内容，使用日常亮度并调暗环境。不要用长时间静态图案尝试修复。",
      "进入全屏，选“纯色循环”，检查灰、红、绿、蓝、白、黑是否有固定徽标、任务栏或窗口轮廓。",
      "选择“低灰阶均匀性”，比较实际提供的 5%、10%、20%、30%、50% 档位。需要时再看“移动色条”和“渐变扫描”。",
      "点“播放”让图案变化；手动选择颜色或灰阶会暂停。连续播放五分钟后会停止并显示黑屏，手动暂停的静态画面不受该计时保护，请及时退出。",
      "记下固定轮廓，回到普通内容。正常使用或休息后再复查，不要一直把测试图案留在屏幕上。",
    ],
    normal: ["多种颜色和日常内容中都没有固定徽标或界面轮廓。暗灰上的轻微条带本身不能确认永久烧屏。"],
    results: [
      { signal: "多种颜色中都出现同位置轮廓", meaning: "可能是图像残留或不均匀老化。一次观察不能区分它是否永久存在。" },
      { signal: "灰色上有条带或云斑", meaning: "可能是近黑均匀性差异，不一定有可辨认的残留图案。用灰阶测试与真实内容比较。" },
      { signal: "普通内容或休息后轮廓逐渐消失", meaning: "更接近暂时残影。记录它在后续复查中如何变化。" },
    ],
    troubleshooting: [
      "确认痕迹能在多色和真实内容中重复出现，再在正常使用或休息后复测。",
      "图案不动时，点“播放”开始循环；手动选色或灰阶会暂停。静态观察请及时结束，暂停时播放计时不工作。",
      "按厂商说明做日常维护。不要为了某张测试图案反复深度像素刷新，也不要长时间显示静态画面。",
    ],
    limitation: "网页不能测像素老化，也不能一次确认永久烧屏或判断保修资格。五分钟停止只保护连续播放，不保护手动暂停的静态观察。",
  },
  "screen-resolution-checker": {
    steps: [
      "把窗口移到目标显示器，浏览器页面缩放恢复 100%，等实时数值稳定。",
      "比较“报告的屏幕”“布局视口”和“可见视口”。屏幕与视口尺寸使用 CSS 像素，视口描述浏览器内容区域。",
      "结合“设备像素比”和“估算输出像素”阅读。估算值用报告的屏幕尺寸乘 DPR；系统缩放和页面缩放都会影响 DPR。",
      "调整窗口、进入全屏或旋转手机，观察视口更新。连同页面缩放和系统缩放一起记录，并对照系统显示设置与显示器菜单。",
    ],
    normal: ["数值随窗口或方向变化更新。缩放和浏览器控制栏可能让 CSS 屏幕尺寸或视口偏小，这本身不代表物理像素减少。"],
    results: [
      { signal: "报告尺寸小于面板规格", meaning: "CSS 像素与系统缩放可以解释差异。例如 4K 输出在 200% 缩放时，可能报告约 1920 × 1080 CSS 像素。" },
      { signal: "视口小于屏幕尺寸", meaning: "窗口大小、标签栏、侧栏和系统界面都会占用内容空间。" },
      { signal: "页面缩放改变 DPR 或估算输出", meaning: "页面缩放能改变 DPR，因此输出尺寸仍是估算。手指捏合缩放通常主要改变可见视口缩放。" },
      { signal: "浏览器帧率或颜色缓冲值出乎预期", meaning: "帧率来自动画回调，不是显示器 Hz。颜色缓冲是浏览器值，不证明面板原生位深。" },
    ],
    troubleshooting: [
      "恢复 100% 页面缩放，把窗口固定在一块显示器上，等数值稳定再比较。",
      "到系统设置和显示器自身菜单核对实际分辨率与缩放，不只凭估算标签确认物理输出。",
      "显示“未报告”或“不支持”时可换浏览器。估算帧率时保持标签页可见；API 不可用不代表硬件故障。",
    ],
    limitation: "浏览器 API 不能可靠读取面板物理分辨率、EDID 型号、实际像素密度或真实刷新率。“估算输出像素”来自计算，不是硬件直接测量。",
  },
} as const satisfies Record<TestGuidanceId, TestGuidance>;

export const TEST_GUIDANCE = {
  en,
  zh,
  de: DE_TEST_GUIDANCE,
} as const satisfies Record<Locale, Record<TestGuidanceId, TestGuidance>>;

export function getTestGuidance(locale: Locale, testId: TestGuidanceId): TestGuidance {
  return TEST_GUIDANCE[locale][testId];
}
