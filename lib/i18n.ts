import { SITE_URL } from "@/lib/site";

export const LOCALES = ["en", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const localeConfig = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    pathPrefix: "",
    label: "EN",
    languageName: "English",
  },
  zh: {
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    pathPrefix: "/zh",
    label: "中文",
    languageName: "简体中文",
  },
} as const satisfies Record<
  Locale,
  {
    htmlLang: string;
    ogLocale: string;
    pathPrefix: string;
    label: string;
    languageName: string;
  }
>;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localizePath(path: string, locale: Locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === "en") {
    return normalized.replace(/^\/zh(?=\/|$)/, "") || "/";
  }

  const englishPath = normalized.replace(/^\/zh(?=\/|$)/, "") || "/";
  return englishPath === "/" ? "/zh" : `/zh${englishPath}`;
}

export function absoluteLocalizedUrl(locale: Locale, path: string = "/") {
  return new URL(localizePath(path, locale), `${SITE_URL}/`).toString();
}

export function localizedAlternates(path: string) {
  return {
    "en-US": absoluteLocalizedUrl("en", path),
    "zh-CN": absoluteLocalizedUrl("zh", path),
    "x-default": absoluteLocalizedUrl("en", path),
  };
}

const EN_DICTIONARY = {
  common: {
    skipToContent: "Skip to content",
    home: "Home",
    breadcrumb: "Breadcrumb",
    screenTests: "Screen tests",
    browserTest: "Browser test",
    noDownload: "No download",
    minutesShort: "min",
    englishContent: "English content",
    nav: {
      mainLabel: "Main navigation",
      tools: "Tools",
      guides: "Guides",
      startCheck: "Start check",
      allTests: "View all screen tests",
      toolsMenuLabel: "Screen test tools",
      open: "Open navigation",
      close: "Close navigation",
      language: "Language",
      switchToEnglish: "Switch to English",
      switchToChinese: "切换到简体中文",
    },
    footer: {
      label: "Footer navigation",
      copy: "Free browser-based screen checks. Nothing gets uploaded, and you do not need an account.",
      allTests: "All tests",
      deadPixels: "Dead pixels",
      motion: "Motion",
      guides: "Guides",
      sitemap: "Sitemap",
      metaPrefix: "Built for browsers, not repair shops. Results stay on this device.",
    },
    logoHome: "ScreenTestHub home",
  },
  rootMetadata: {
    title: "ScreenTestHub: Free Online Screen Tests",
    titleTemplate: "%s | ScreenTestHub",
    description:
      "Test your monitor or phone for dead pixels, backlight bleed, banding, color shifts, and motion blur in your browser.",
    ogTitle: "ScreenTestHub: Test your screen. Trust what you see.",
    ogDescription:
      "Seven focused browser tests for dead pixels, backlight bleed, color, gradients, uniformity, and motion.",
    ogImageAlt: "ScreenTestHub display test pattern",
    twitterTitle: "ScreenTestHub: Free Online Screen Tests",
    twitterDescription: "Find common screen problems with focused browser tests.",
  },
  home: {
    metadataTitle: "Free Online Screen Tests for Monitors and Phones",
    metadataDescription:
      "Run seven focused screen tests for dead pixels, backlight bleed, uniformity, gradients, color, and motion. Free, private, and browser based.",
    eyebrow: "Browser screen test bench",
    title: "Test your screen. Spot problems fast.",
    lede:
      "Check dead pixels, backlight bleed, banding, color shifts, and motion blur in about two minutes. No download. No account. No mystery score.",
    start: "Start screen check",
    choose: "Choose one test",
    symptomTitle: "What looks wrong?",
    symptomIntro:
      "Pick the closest symptom. Each test isolates one thing, so you spend less time staring at a random rainbow video.",
    symptoms: [
      {
        title: "One bright dot will not leave",
        detail: "Check black, white, red, green, and blue.",
        href: "/tests/dead-pixel",
      },
      {
        title: "Black corners glow in a dark room",
        detail: "Separate edge bleed from normal viewing angle glow.",
        href: "/tests/backlight-bleed",
      },
      {
        title: "Gray looks cloudy or patchy",
        detail: "Scan six brightness levels for uneven areas.",
        href: "/tests/grayscale",
      },
      {
        title: "Smooth shades turn into stripes",
        detail: "Look for steps in neutral and color gradients.",
        href: "/tests/gradient",
      },
      {
        title: "Moving text leaves a trail",
        detail: "Adjust speed and compare ghosting by eye.",
        href: "/tests/motion",
      },
      {
        title: "Colors look wrong beside another display",
        detail: "Cycle primary colors without loading an image.",
        href: "/tests/color",
      },
    ],
    guidedTitle: "Run the full check in one calm pass.",
    guidedIntro:
      "Six scenes, simple keyboard controls, and a short result at the end. Your answers stay in this tab.",
    guidedCta: "Begin guided test",
    methodEyebrow: "A useful result, not a diagnosis",
    methodTitle: "Three checks before you panic.",
    methodIntro:
      "A browser test is good evidence, but it cannot see your panel. Use these steps to rule out the easy mistakes first.",
    steps: [
      {
        label: "CLEAN FIRST",
        title: "Wipe the screen",
        detail: "Dust and tiny smears love pretending to be failed pixels.",
      },
      {
        label: "ISOLATE THE PATTERN",
        title: "Use one pattern",
        detail: "Fullscreen removes tabs, wallpaper, and other visual noise.",
      },
      {
        label: "CONFIRM THE MARK",
        title: "Change input or angle",
        detail: "If the mark stays put, document it before the return window closes.",
      },
    ],
    guidesTitle: "Know what the pattern means.",
    guidesIntro:
      "Short guides for the awkward part: deciding whether you found a real fault or a normal display quirk.",
    allGuides: "Read all guides",
    faqTitle: "Straight answers.",
    faqIntro: "The tool is simple on purpose. Here is what it can and cannot do.",
    faqs: [
      {
        question: "Can a website really find a dead pixel?",
        answer:
          "It can make a bad pixel easier to see by filling the panel with clean colors. You still make the diagnosis. Dust, a scratch, and a stuck pixel can look alike, so clean the screen before you start.",
      },
      {
        question: "Will these tests fix my screen?",
        answer:
          "No. They help you spot and document a problem. Avoid pressing or rubbing the panel. If the display is new, check the return window before trying any risky repair advice.",
      },
      {
        question: "Do you upload screenshots or test results?",
        answer:
          "No. The test patterns are drawn in your browser and guided answers stay in the current page. There is no account, database, or upload step.",
      },
      {
        question: "Should brightness be set to 100 percent?",
        answer:
          "Usually not. Start with the brightness you use every day. For backlight bleed, test again in a dark room at a moderate setting so an unrealistic maximum does not exaggerate the result.",
      },
    ],
    websiteDescription: "Free browser screen tests for monitors, laptops, tablets, and phones.",
    appDescription:
      "A guided visual screen check for common pixel, lighting, color, gradient, and motion problems.",
  },
  testsIndex: {
    metadataTitle: "Free Online Screen Tests | ScreenTestHub",
    metadataDescription:
      "Run free browser screen tests for dead pixels, backlight bleed, grayscale uniformity, gradient banding, color, and motion.",
    ogDescription:
      "Pick one focused screen test or run the complete guided check in about two minutes.",
    collectionName: "Online screen tests",
    libraryName: "ScreenTestHub test library",
    breadcrumb: "Screen tests",
    count: "Seven browser tests",
    title: "Screen tests that make defects obvious.",
    lead:
      "Pick the symptom you see, or run the guided check when the screen is simply acting suspicious.",
    libraryLabel: "Screen test library",
    runAll: "Run all checks",
  },
  testPage: {
    before: "Before you start",
    lookFor: "What to look for",
    keepChecking: "Keep checking",
    toolSuffix: " tool",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "A modern browser with JavaScript. Fullscreen support is optional.",
  },
  guidesIndex: {
    metadataTitle: "Screen Test Guides",
    metadataDescription:
      "Practical guides for checking dead pixels, backlight bleed, screen uniformity, and motion blur at home.",
    ogDescription:
      "Practical checks for common screen problems, with clear steps and no lab coat required.",
    collectionDescription:
      "Practical guides for checking common screen and monitor problems at home.",
    eyebrow: "Screen test guides",
    title: "Check the panel. Keep your sanity.",
    lead:
      "Four short field guides for the marks, glows, bands, and trails that make a new screen feel suspicious.",
    totalTime: "About 10 minutes to read the lot.",
    listLabel: "All screen test guides",
    updated: "Updated",
  },
  states: {
    notFoundCode: "ERROR / 404",
    notFoundTitle: "This pixel is outside the panel.",
    notFoundBody: "That page moved, disappeared, or never existed.",
    openTests: "Open all tests",
    backHome: "Back home",
    errorCode: "TEST INTERRUPTED",
    errorTitle: "The page hit a bad signal.",
    errorBody: "Your test results were not uploaded or stored.",
    tryAgain: "Try this page again",
    loading: "Loading screen test",
  },
  sampler: {
    label: "Interactive color preview",
    panelSample: "Panel sample",
    live: "Live",
    previewColors: "Preview colors",
    showSample: "Show {color} sample",
    colors: ["Black", "White", "Red", "Green", "Blue", "Gray"],
  },
} as const;

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly DeepWiden<U>[]
      : T extends object
        ? { readonly [K in keyof T]: DeepWiden<T[K]> }
        : T;

export type Dictionary = DeepWiden<typeof EN_DICTIONARY>;

const ZH_DICTIONARY = {
  common: {
    skipToContent: "跳到主要内容",
    home: "首页",
    breadcrumb: "面包屑导航",
    screenTests: "屏幕测试",
    browserTest: "浏览器测试",
    noDownload: "无需下载",
    minutesShort: "分钟",
    englishContent: "英文内容",
    nav: {
      mainLabel: "主导航",
      tools: "测试工具",
      guides: "指南",
      startCheck: "开始检查",
      allTests: "查看全部屏幕测试",
      toolsMenuLabel: "屏幕测试工具",
      open: "打开导航",
      close: "关闭导航",
      language: "语言",
      switchToEnglish: "Switch to English",
      switchToChinese: "切换到简体中文",
    },
    footer: {
      label: "页脚导航",
      copy: "免费的浏览器屏幕检查。无需账号，任何内容都不会上传。",
      allTests: "全部测试",
      deadPixels: "坏点测试",
      motion: "动态测试",
      guides: "指南",
      sitemap: "网站地图",
      metaPrefix: "为浏览器而做，不冒充维修店。结果只留在这台设备上。",
    },
    logoHome: "ScreenTestHub 首页",
  },
  rootMetadata: {
    title: "ScreenTestHub：免费在线屏幕测试",
    titleTemplate: "%s | ScreenTestHub",
    description: "直接在浏览器中检查显示器或手机的坏点、漏光、色带、偏色和动态拖影。",
    ogTitle: "ScreenTestHub：测一下屏幕，看得更放心",
    ogDescription: "7 项专注的浏览器测试，覆盖坏点、漏光、色彩、渐变、均匀性和动态表现。",
    ogImageAlt: "ScreenTestHub 显示器测试图案",
    twitterTitle: "ScreenTestHub：免费在线屏幕测试",
    twitterDescription: "用专门的浏览器测试快速找出常见屏幕问题。",
  },
  home: {
    metadataTitle: "显示器与手机免费在线屏幕测试",
    metadataDescription: "免费运行 7 项屏幕测试，检查坏点、漏光、均匀性、渐变、色彩和动态拖影。无需下载，不上传数据。",
    eyebrow: "浏览器屏幕测试台",
    title: "测一下屏幕，问题马上现形。",
    lede: "大约两分钟检查坏点、漏光、色带、偏色和动态拖影。无需下载，无需账号，没有玄学评分。",
    start: "开始屏幕检查",
    choose: "选择单项测试",
    symptomTitle: "屏幕哪里不对劲？",
    symptomIntro: "选一个最接近的症状。每项测试只盯一个问题，少看几分钟没用的彩虹视频。",
    symptoms: [
      { title: "有个亮点怎么都不消失", detail: "依次检查黑、白、红、绿、蓝。", href: "/tests/dead-pixel" },
      { title: "黑暗房间里，屏幕边角发亮", detail: "分清固定漏光和随视角变化的泛光。", href: "/tests/backlight-bleed" },
      { title: "灰色看起来发花、不均匀", detail: "用 6 档灰阶检查暗斑和亮度差异。", href: "/tests/grayscale" },
      { title: "平滑渐变变成一条条色带", detail: "检查中性和彩色渐变里有没有明显断层。", href: "/tests/gradient" },
      { title: "移动文字后面拖着一条影子", detail: "调整速度，直接观察拖影和亮边。", href: "/tests/motion" },
      { title: "和另一块屏幕放一起，颜色不对", detail: "直接切换纯色，不经过图片压缩。", href: "/tests/color" },
    ],
    guidedTitle: "一次安静地把整套检查跑完。",
    guidedIntro: "6 个画面，简单的键盘控制，最后给出一段清楚的结果。答案只留在当前标签页。",
    guidedCta: "开始引导测试",
    methodEyebrow: "这是有用的线索，不是诊断书",
    methodTitle: "先做这三件事，再决定要不要慌。",
    methodIntro: "浏览器测试能提供证据，但看不到屏幕内部。先排除三个最常见的误会。",
    steps: [
      { label: "先擦干净", title: "清洁屏幕", detail: "灰尘和小油点最爱假装成坏点。" },
      { label: "只看一种图案", title: "进入全屏", detail: "全屏会拿掉标签页、壁纸和其他视觉干扰。" },
      { label: "确认位置", title: "换输入源或视角", detail: "如果痕迹一直不动，在退换期结束前拍照记录。" },
    ],
    guidesTitle: "看懂测试图案在说什么。",
    guidesIntro: "真正麻烦的是判断：这是屏幕故障，还是面板本来就会有的现象。下面的文章暂时只有英文。",
    allGuides: "查看全部指南",
    faqTitle: "直接说答案。",
    faqIntro: "工具故意做得很简单。它能做什么、不能做什么，都写清楚。",
    faqs: [
      { question: "网站真的能找到坏点吗？", answer: "它能用干净的纯色背景让异常像素更显眼，但最后仍要由你判断。灰尘、划痕和卡住的子像素可能很像，所以先把屏幕擦干净。" },
      { question: "这些测试能修好屏幕吗？", answer: "不能。它们只帮你发现和记录问题。不要按压或摩擦面板。如果设备刚买，先确认退换期限，再考虑任何有风险的修复方法。" },
      { question: "会上传截图或测试结果吗？", answer: "不会。测试图案直接在浏览器中绘制，引导测试的回答只保留在当前页面。没有账号、数据库或上传步骤。" },
      { question: "亮度需要调到 100% 吗？", answer: "通常不需要。先用日常亮度测试。检查漏光时，可以在暗室里用中等亮度再看一次，避免不现实的最高亮度把问题夸大。" },
    ],
    websiteDescription: "适用于显示器、笔记本、平板和手机的免费浏览器屏幕测试。",
    appDescription: "一套检查像素、漏光、色彩、渐变和动态问题的引导式屏幕测试。",
  },
  testsIndex: {
    metadataTitle: "免费在线屏幕测试 | ScreenTestHub",
    metadataDescription: "免费检查坏点、漏光、灰阶均匀性、渐变色带、色彩和动态拖影。全部测试直接在浏览器中运行。",
    ogDescription: "选择一项专门测试，或者用大约两分钟跑完整套引导检查。",
    collectionName: "在线屏幕测试",
    libraryName: "ScreenTestHub 测试库",
    breadcrumb: "屏幕测试",
    count: "7 项浏览器测试",
    title: "让屏幕缺陷无处藏。",
    lead: "按你看到的症状选择测试。如果只觉得屏幕哪里怪怪的，就直接跑完整检查。",
    libraryLabel: "屏幕测试库",
    runAll: "运行全部检查",
  },
  testPage: {
    before: "开始之前",
    lookFor: "重点看什么",
    keepChecking: "继续检查",
    toolSuffix: "工具",
    applicationCategory: "实用工具",
    operatingSystem: "任何系统",
    browserRequirements: "需要支持 JavaScript 的现代浏览器，全屏功能不是必需条件。",
  },
  guidesIndex: {
    metadataTitle: "屏幕测试指南",
    metadataDescription: "了解如何在家检查坏点、漏光、屏幕均匀性和动态拖影。文章正文暂时只有英文。",
    ogDescription: "用清楚的步骤检查常见屏幕问题，不用穿白大褂。文章正文暂时只有英文。",
    collectionDescription: "在家检查常见屏幕与显示器问题的实用指南，正文为英文。",
    eyebrow: "屏幕测试指南",
    title: "把面板看明白，别先吓自己。",
    lead: "4 篇短指南，解释新屏幕上那些让人起疑的亮点、漏光、色带和拖影。正文暂时只有英文。",
    totalTime: "全部读完大约 10 分钟。",
    listLabel: "全部屏幕测试指南",
    updated: "更新于",
  },
  states: {
    notFoundCode: "错误 / 404",
    notFoundTitle: "这个像素跑到屏幕外面了。",
    notFoundBody: "页面可能搬走了、消失了，或者从来就不存在。",
    openTests: "打开全部测试",
    backHome: "返回首页",
    errorCode: "测试中断",
    errorTitle: "页面收到了一段坏信号。",
    errorBody: "你的测试结果没有上传，也没有被保存。",
    tryAgain: "重新加载此页面",
    loading: "正在加载屏幕测试",
  },
  sampler: {
    label: "交互式颜色预览",
    panelSample: "面板样本",
    live: "实时",
    previewColors: "预览颜色",
    showSample: "显示{color}样本",
    colors: ["黑色", "白色", "红色", "绿色", "蓝色", "灰色"],
  },
} as const satisfies Dictionary;

const DICTIONARIES = {
  en: EN_DICTIONARY,
  zh: ZH_DICTIONARY,
} as const satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type NavigationMessages = Dictionary["common"]["nav"];
export type SamplerMessages = Dictionary["sampler"];
