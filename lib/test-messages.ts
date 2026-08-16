import type { Locale } from "@/lib/i18n";

const EN_TEST_MESSAGES = {
  fullscreen: {
    controlsLabel: "{name} controls",
    shortcutSummary: "F fullscreen, H hide controls",
    previous: "Previous",
    previousLabel: "Previous pattern",
    next: "Next",
    nextLabel: "Next pattern",
    hideControls: "Hide controls",
    exitFullscreen: "Exit fullscreen",
    enterFullscreen: "Enter fullscreen",
    unavailable:
      "Fullscreen is not available in this browser. The test still works in the panel above.",
    unavailableHere:
      "Fullscreen is not available here. The test still works inside this page.",
    refused:
      "The browser refused fullscreen. Try the button again or use the browser's fullscreen command.",
    keyboardHelp:
      "Use F for fullscreen, H to hide controls, and the arrow keys to change patterns when available. Moving the pointer restores hidden controls.",
    clickHelp: "Click the full-screen test surface to show the next pattern.",
  },
  colorCycle: {
    deadPixelName: "Dead pixel test",
    colorName: "Monitor color test",
    testColor: "Test color",
    manual: "Manual mode.",
    cycling: "Cycling every {seconds}s.",
    surface: "Full-screen {color} test pattern",
    pause: "Pause cycle",
    auto: "Auto cycle",
    interval: "Cycle interval",
    oneSecond: "1 second",
    onePointFiveSeconds: "1.5 seconds",
    twoPointFiveSeconds: "2.5 seconds",
    colors: ["White", "Black", "Red", "Green", "Blue", "Cyan", "Magenta", "Yellow"],
  },
  backlight: {
    name: "Backlight bleed test",
    status: "Black pattern. Hide the controls for a clean edge check.",
    surface: "Full-screen pure black backlight bleed pattern",
    title: "Look straight at the panel",
    detail: "Brightness at your normal level is more useful than forcing it to 100%.",
  },
  gray: {
    name: "Grayscale and uniformity test",
    status: "{level}% gray. Look for tint, cloudy patches, and darker edges.",
    surface: "Full-screen {level}% gray uniformity pattern",
    levelLabel: "Gray level",
  },
  gradient: {
    name: "Gradient banding test",
    status: "{channel}, {orientation}. Look for hard bands or sudden color jumps.",
    surface: "Full-screen {orientation} {channel} gradient from black",
    channelLabel: "Gradient channel",
    directionLabel: "Gradient direction",
    channels: ["Neutral", "Red", "Green", "Blue"],
    horizontal: "Horizontal",
    vertical: "Vertical",
  },
  motion: {
    name: "Motion and ghosting test",
    running: "Running",
    paused: "Paused",
    status: "{state} at {speed} px/s.",
    surface: "Moving high-contrast target at {speed} pixels per second",
    pause: "Pause target",
    start: "Start target",
    speedLabel: "Target speed",
    reduced:
      "Motion is paused because your device requests reduced motion. Start it only when you are ready for a moving test pattern.",
  },
  guided: {
    name: "Guided screen test",
    steps: [
      {
        name: "White",
        prompt: "Look for dark dots, dust, dim patches, and tinted edges.",
        surface: "Full-screen pure white inspection pattern",
      },
      {
        name: "Black",
        prompt: "In a dim room, look for bright edges and cloudy corners.",
        surface: "Full-screen pure black inspection pattern",
      },
      {
        name: "RGB",
        prompt: "Check whether any fixed dot refuses to match its color area.",
        surface: "Full-screen red, green, and blue inspection pattern",
      },
      {
        name: "Gray",
        prompt: "Scan for cloudy patches, tint, and uneven brightness.",
        surface: "Full-screen 50% gray uniformity pattern",
      },
      {
        name: "Gradient",
        prompt: "A smooth ramp should not break into hard stripes or blocks.",
        surface: "Full-screen neutral gradient banding pattern",
      },
      {
        name: "Motion",
        prompt: "Follow the target and watch for dark smears or bright halos.",
        surface: "Moving high-contrast target at 480 pixels per second",
      },
    ],
    status: "{name}, {current} of {total}.",
    recordLabel: "Record this check",
    looksNormal: "Looks normal",
    noticed: "Noticed something",
    skip: "Skip",
    skipped: "Skipped",
    notChecked: "Not checked",
    pause: "Pause target",
    start: "Start target",
    summaryNone: "Nothing obvious showed up.",
    summaryOne: "1 check needs a closer look.",
    summaryMany: "{count} checks need a closer look.",
    summaryBody:
      "This summary stays in this tab. It is a visual check, not a hardware diagnosis, so confirm anything suspicious with the focused test.",
    runAgain: "Run again",
    reduced:
      "Motion is paused because your device requests reduced motion. Start it only when you are ready for the moving pattern.",
  },
} as const;

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepWiden<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepWiden<T[K]> }
      : T;

export type TestMessages = DeepWiden<typeof EN_TEST_MESSAGES>;

const ZH_TEST_MESSAGES = {
  fullscreen: {
    controlsLabel: "{name}控制栏",
    shortcutSummary: "F 进入全屏，H 隐藏控制栏",
    previous: "上一项",
    previousLabel: "显示上一个图案",
    next: "下一项",
    nextLabel: "显示下一个图案",
    hideControls: "隐藏控制栏",
    exitFullscreen: "退出全屏",
    enterFullscreen: "进入全屏",
    unavailable: "此浏览器无法进入全屏，但仍可在上方区域完成测试。",
    unavailableHere: "这里无法进入全屏，但测试仍可在当前页面中运行。",
    refused: "浏览器拒绝进入全屏。请再试一次，或使用浏览器自带的全屏命令。",
    keyboardHelp: "按 F 进入全屏，按 H 隐藏控制栏。可用时，方向键会切换图案。移动指针可恢复隐藏的控制栏。",
    clickHelp: "点击全屏测试区域可显示下一个图案。",
  },
  colorCycle: {
    deadPixelName: "坏点测试",
    colorName: "显示器色彩测试",
    testColor: "测试颜色",
    manual: "手动模式。",
    cycling: "每 {seconds} 秒自动切换。",
    surface: "全屏{color}测试图案",
    pause: "暂停切换",
    auto: "自动切换",
    interval: "切换间隔",
    oneSecond: "1 秒",
    onePointFiveSeconds: "1.5 秒",
    twoPointFiveSeconds: "2.5 秒",
    colors: ["白色", "黑色", "红色", "绿色", "蓝色", "青色", "品红色", "黄色"],
  },
  backlight: {
    name: "漏光测试",
    status: "当前为黑色图案。隐藏控制栏，检查边缘会更准确。",
    surface: "用于检查漏光的全屏纯黑图案",
    title: "正对屏幕观察",
    detail: "使用日常亮度比强行调到 100% 更有参考价值。",
  },
  gray: {
    name: "灰阶与均匀性测试",
    status: "当前为 {level}% 灰阶。检查偏色、云状暗斑和较暗的边缘。",
    surface: "全屏 {level}% 灰阶均匀性图案",
    levelLabel: "灰阶级别",
  },
  gradient: {
    name: "渐变色带测试",
    status: "{channel}，{orientation}。检查硬色带或突然的颜色跳变。",
    surface: "从黑色开始的全屏{orientation}{channel}渐变",
    channelLabel: "渐变通道",
    directionLabel: "渐变方向",
    channels: ["中性", "红色", "绿色", "蓝色"],
    horizontal: "水平",
    vertical: "垂直",
  },
  motion: {
    name: "动态与拖影测试",
    running: "运行中",
    paused: "已暂停",
    status: "{state}，速度 {speed} 像素/秒。",
    surface: "速度为每秒 {speed} 像素的高对比度移动目标",
    pause: "暂停目标",
    start: "启动目标",
    speedLabel: "目标速度",
    reduced: "设备启用了减少动态效果，因此目标默认暂停。准备好观察移动图案后再启动。",
  },
  guided: {
    name: "引导式屏幕测试",
    steps: [
      { name: "白色", prompt: "检查暗点、灰尘、暗斑和边缘偏色。", surface: "全屏纯白检查图案" },
      { name: "黑色", prompt: "在较暗的房间里，检查发亮的边缘和云状亮斑。", surface: "全屏纯黑检查图案" },
      { name: "RGB", prompt: "检查有没有固定小点始终无法匹配所在区域的颜色。", surface: "全屏红绿蓝检查图案" },
      { name: "灰色", prompt: "检查云状斑块、偏色和亮度不均。", surface: "全屏 50% 灰阶均匀性图案" },
      { name: "渐变", prompt: "平滑渐变不应该断成明显的条纹或色块。", surface: "全屏中性渐变色带检查图案" },
      { name: "动态", prompt: "跟随移动目标，观察暗色拖影或亮色光晕。", surface: "速度为每秒 480 像素的高对比度移动目标" },
    ],
    status: "{name}，第 {current} 项，共 {total} 项。",
    recordLabel: "记录本项结果",
    looksNormal: "看起来正常",
    noticed: "发现异常",
    skip: "跳过",
    skipped: "已跳过",
    notChecked: "未检查",
    pause: "暂停目标",
    start: "启动目标",
    summaryNone: "没有发现明显问题。",
    summaryOne: "有 1 项需要仔细复查。",
    summaryMany: "有 {count} 项需要仔细复查。",
    summaryBody: "结果只保留在当前标签页。这是目视检查，不是硬件诊断。任何可疑现象都应使用对应的单项测试再次确认。",
    runAgain: "重新测试",
    reduced: "设备启用了减少动态效果，因此目标默认暂停。准备好观察移动图案后再启动。",
  },
} as const satisfies TestMessages;

const TEST_MESSAGES = {
  en: EN_TEST_MESSAGES,
  zh: ZH_TEST_MESSAGES,
} as const satisfies Record<Locale, TestMessages>;

export function getTestMessages(locale: Locale): TestMessages {
  return TEST_MESSAGES[locale];
}

export type FullscreenMessages = TestMessages["fullscreen"];

