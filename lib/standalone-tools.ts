import type { Locale } from "@/lib/i18n";

export const STANDALONE_TOOL_SLUGS = [
  "touch-screen-test",
  "hdr-test",
  "screen-tearing-test",
  "monitor-color-calibration",
  "oled-burn-in-test",
  "screen-resolution-checker",
] as const;

export type StandaloneToolSlug = (typeof STANDALONE_TOOL_SLUGS)[number];

type Observation = { readonly signal: string; readonly meaning: string };
type Faq = { readonly question: string; readonly answer: string };
type RelatedTool = { readonly href: `/${string}`; readonly label: string };

export type StandaloneToolCopy = {
  readonly title: string;
  readonly seoTitle: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly shortName: string;
  readonly modeSummary: string;
  readonly duration: string;
  readonly startLabel: string;
  readonly toolLabel: string;
  readonly howTitle: string;
  readonly preparation: readonly string[];
  readonly lookTitle: string;
  readonly observations: readonly Observation[];
  readonly limitation: string;
  readonly faqTitle: string;
  readonly faqs: readonly Faq[];
  readonly relatedTitle: string;
  readonly related: readonly RelatedTool[];
};

type ToolDictionary = Record<StandaloneToolSlug, StandaloneToolCopy>;

const zh: ToolDictionary = {
  "touch-screen-test": {
    title: "触摸屏测试",
    seoTitle: "在线触摸屏测试：检查触控死区与多点触控",
    description: "在浏览器里检查手机、平板和触控显示器的触控死区、边角响应与多点触控，无需安装应用。",
    keywords: ["触摸屏测试", "触控死区测试", "多点触控测试"],
    shortName: "触摸屏",
    modeSummary: "网格覆盖与多点触控",
    duration: "约 2 分钟",
    startLabel: "开始触摸测试",
    toolLabel: "在线触摸屏测试工具",
    howTitle: "怎么做触摸屏测试",
    preparation: [
      "先擦干净屏幕，并拔掉会干扰触控的手套或厚保护膜。",
      "进入全屏，从四个角开始，用手指连续划过每一格。",
      "用两根或更多手指同时移动，观察峰值触点数量。",
      "对空白格重复两次，再判断它是不是固定死区。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "同一块区域反复留白", meaning: "这里可能存在触控死区，也可能被保护膜、边框或手势拦截。" },
      { signal: "线条突然跳到别处", meaning: "触控坐标可能漂移，先清洁屏幕并移除充电器后重测。" },
      { signal: "多根手指只识别一部分", meaning: "设备或浏览器可能限制同时触点数量。" },
    ],
    limitation: "网页只能记录浏览器收到的指针事件，不能读取触控控制器固件，也不能替代维修检测。",
    faqTitle: "触摸屏测试常见问题",
    faqs: [
      { question: "鼠标能用这个测试吗？", answer: "可以预览流程，但鼠标只能模拟单个指针，不能证明触摸或多点触控正常。" },
      { question: "换屏后边缘失灵怎么办？", answer: "先去掉保护膜和外壳重测；若死区位置固定，再检查排线、屏幕型号与安装压力。" },
      { question: "测试结果会上传吗？", answer: "不会。网格和结果都在当前浏览器标签页里生成。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/screen-resolution-checker", label: "屏幕分辨率检测" },
      { href: "/tests/dead-pixel", label: "坏点测试" },
      { href: "/tests/guided", label: "引导式屏幕测试" },
    ],
  },
  "hdr-test": {
    title: "HDR 在线测试",
    seoTitle: "HDR 在线测试：检查显示器动态范围与广色域",
    description: "检查浏览器报告的 HDR 环境，并观察暗部、高光、局部调光光晕和广色域差异。",
    keywords: ["HDR 测试", "显示器 HDR 测试", "广色域测试"],
    shortName: "HDR",
    modeSummary: "3 种测试模式",
    duration: "约 2 分钟",
    startLabel: "开始 HDR 测试",
    toolLabel: "HDR 在线测试工具",
    howTitle: "怎么使用 HDR 测试",
    preparation: [
      "在系统里开启 HDR，并把窗口移到要检查的显示器。",
      "进入全屏，用按钮或方向键切换检测、动态范围和广色域。",
      "在较暗环境里观察黑阶与高光，不要中途切换显示器预设。",
      "比较 sRGB 与广色域色块，记录明显的饱和度变化。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "最暗几级全部并入黑色", meaning: "黑位、Gamma、输出范围或局部调光可能压掉了暗部细节。" },
      { signal: "最亮几级看起来完全相同", meaning: "色调映射或对比度设置可能剪掉了高光。" },
      { signal: "小白块周围出现光圈", meaning: "LCD 或 Mini LED 的局部调光可能产生光晕。" },
    ],
    limitation: "网页不能测量尼特亮度、真实黑位、面板位深或 HDR 认证；这里展示的是浏览器信号与视觉图案。",
    faqTitle: "HDR 测试常见问题",
    faqs: [
      { question: "显示器支持 HDR，为什么仍显示 SDR？", answer: "请确认系统 HDR 已开启、窗口位于正确显示器，并检查线缆、显卡输出与浏览器支持。" },
      { question: "网页能测峰值亮度吗？", answer: "不能。准确亮度需要仪器和受控测试图案。" },
      { question: "能识别 HDR10 或 Dolby Vision 吗？", answer: "不能。浏览器只能报告当前环境是否为高动态范围，不能确认具体视频格式。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/tests/color", label: "显示器色彩测试" },
      { href: "/tests/gradient", label: "渐变色带测试" },
      { href: "/tests/backlight-bleed", label: "漏光测试" },
    ],
  },
  "screen-tearing-test": {
    title: "屏幕撕裂测试",
    seoTitle: "在线屏幕撕裂测试：检查 VSync、FreeSync 与 G-Sync",
    description: "用移动条纹、分层方块和滚动棋盘格对比垂直同步、可变刷新率与帧率限制设置。",
    keywords: ["屏幕撕裂测试", "垂直同步测试", "FreeSync 测试"],
    shortName: "屏幕撕裂",
    modeSummary: "3 种动态图案",
    duration: "约 2 分钟",
    startLabel: "开始撕裂测试",
    toolLabel: "在线屏幕撕裂测试工具",
    howTitle: "怎么做屏幕撕裂测试",
    preparation: [
      "进入全屏，先用高速条纹观察锐利边缘。",
      "再切换分层方块和棋盘格，确认横向断层是否重复出现。",
      "分别在当前设置和更改 VSync、FreeSync、G-Sync 后测试。",
      "对比时保持浏览器缩放、刷新率和显示器不变。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "画面中出现横向错位断层", meaning: "这最接近屏幕撕裂：上下区域显示了不同时间的画面。" },
      { signal: "整个图案一起停顿或跳动", meaning: "这更像掉帧或卡顿，不是撕裂。" },
      { signal: "移动边缘后面留下黑影或亮边", meaning: "这是拖影或过驱过冲，建议打开动态测试。" },
    ],
    limitation: "浏览器通常会同步页面合成，因此这个工具不能关闭 VSync 或认证 VRR；请在真正出问题的游戏里复测。",
    faqTitle: "屏幕撕裂常见问题",
    faqs: [
      { question: "为什么网页很顺，游戏仍会撕裂？", answer: "浏览器合成器和游戏使用不同的全屏、帧率和同步路径，网页结果不能代替游戏内测试。" },
      { question: "高刷新率能彻底消除撕裂吗？", answer: "不能。高刷新率会缩短断层可见时间，但不同步的帧仍可能撕裂。" },
      { question: "怎么区分撕裂、卡顿和拖影？", answer: "撕裂是横向错位，卡顿是整体停跳，拖影是移动边缘后面的尾巴。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/tests/motion", label: "显示器拖影测试" },
      { href: "/tests/guided", label: "引导式屏幕测试" },
      { href: "/hdr-test", label: "HDR 在线测试" },
    ],
  },
  "monitor-color-calibration": {
    title: "显示器色彩校准",
    seoTitle: "在线显示器色彩校准：调整黑位、白位、Gamma 与色彩",
    description: "用浏览器测试图案逐步调整显示器的黑位、白位、灰阶、Gamma 2.2 与色彩分离。",
    keywords: ["显示器色彩校准", "显示器校色", "Gamma 2.2 测试"],
    shortName: "色彩校准",
    modeSummary: "4 个校准步骤",
    duration: "约 5 分钟",
    startLabel: "开始校准",
    toolLabel: "在线显示器色彩校准工具",
    howTitle: "怎么进行视觉校准",
    preparation: [
      "让显示器预热 20 分钟，关闭夜间模式和动态对比度。",
      "先恢复合适的 SDR 预设，再调整亮度与对比度。",
      "依次检查黑白电平、中性灰阶、Gamma 2.2 和色彩分离。",
      "每次只改一个 OSD 选项，并记录原始值。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "暗部方块全部消失", meaning: "黑位或输出范围可能设置过低。" },
      { signal: "亮部方块融成纯白", meaning: "对比度可能过高，导致高光剪裁。" },
      { signal: "灰阶带有红、绿或蓝色", meaning: "白平衡或色温可能偏移。" },
    ],
    limitation: "这是视觉调整，不会生成 ICC 配置，也不能测量 Delta E；准确校准需要色度计或分光仪。",
    faqTitle: "显示器校准常见问题",
    faqs: [
      { question: "网页真的能校准显示器吗？", answer: "它能提供稳定图案指导你调整 OSD，但不能测量面板发出的光。" },
      { question: "SDR 应该用什么 Gamma？", answer: "普通桌面通常以 Gamma 2.2 为起点；专业工作请遵循目标标准和环境要求。" },
      { question: "校准前要关闭 HDR 吗？", answer: "校准 SDR 时建议关闭 HDR 与动态增强，避免系统色调映射改变图案。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/tests/grayscale", label: "灰阶均匀性测试" },
      { href: "/tests/gradient", label: "渐变色带测试" },
      { href: "/tests/color", label: "显示器色彩测试" },
    ],
  },
  "oled-burn-in-test": {
    title: "OLED 烧屏测试",
    seoTitle: "OLED 烧屏与残影测试：检查图像残留和均匀性",
    description: "使用纯色、低灰阶、移动色条和渐变检查 OLED 烧屏、暂时残影与面板不均匀。",
    keywords: ["OLED 烧屏测试", "OLED 残影测试", "OLED 均匀性测试"],
    shortName: "OLED 烧屏",
    modeSummary: "4 种低风险图案",
    duration: "最多 5 分钟",
    startLabel: "开始 OLED 测试",
    toolLabel: "OLED 烧屏与残影测试工具",
    howTitle: "怎么安全检查 OLED",
    preparation: [
      "先让屏幕显示普通动态内容几分钟，再降低环境光。",
      "进入全屏，依次检查纯色和 1%–10% 低灰阶。",
      "观察固定的徽标、任务栏或窗口轮廓，不要盯着短暂噪点。",
      "测试会在 5 分钟安全停止；不要反复长时间显示同一图案。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "不同颜色下都有固定轮廓", meaning: "这更像长期烧屏，而不是内容本身。" },
      { signal: "低灰阶出现条带或脏屏", meaning: "可能是 OLED 近黑均匀性差异，轻微情况并不少见。" },
      { signal: "痕迹在正常内容后逐渐消失", meaning: "这更像暂时图像残留。" },
    ],
    limitation: "视觉测试无法判断像素老化程度或保修资格；不要用长时间静态图案尝试“修复”烧屏。",
    faqTitle: "OLED 烧屏常见问题",
    faqs: [
      { question: "烧屏和暂时残影有什么区别？", answer: "残影通常会随正常内容逐渐消失；烧屏会在多种颜色和多次测试中固定存在。" },
      { question: "应该手动运行像素刷新吗？", answer: "先遵循厂商说明。深度手动刷新属于维护流程，不应反复运行。" },
      { question: "LCD 也能用这个测试吗？", answer: "可以观察残影与均匀性，但测试名称和风险说明主要针对 OLED。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/tests/grayscale", label: "灰阶均匀性测试" },
      { href: "/tests/color", label: "显示器色彩测试" },
      { href: "/tests/backlight-bleed", label: "漏光测试" },
    ],
  },
  "screen-resolution-checker": {
    title: "屏幕分辨率检测",
    seoTitle: "在线屏幕分辨率检测：查看视口、像素比与宽高比",
    description: "实时查看浏览器报告的屏幕尺寸、视口、设备像素比、宽高比、方向与色深。",
    keywords: ["屏幕分辨率检测", "浏览器视口检测", "设备像素比"],
    shortName: "屏幕分辨率",
    modeSummary: "实时浏览器测量",
    duration: "即时结果",
    startLabel: "打开分辨率检测",
    toolLabel: "在线屏幕分辨率检测工具",
    howTitle: "怎么看这些分辨率数据",
    preparation: [
      "把窗口移到要检查的显示器，等待数值稳定。",
      "进入全屏，对比系统缩放前后的报告尺寸与视口。",
      "旋转手机或调整窗口，确认方向和可见视口会实时更新。",
      "截图记录缩放比例、像素比和浏览器环境，便于排查。",
    ],
    lookTitle: "重点看什么",
    observations: [
      { signal: "报告分辨率小于面板规格", meaning: "系统缩放或浏览器报告的是 CSS 像素，不一定代表物理像素减少。" },
      { signal: "视口小于屏幕尺寸", meaning: "浏览器标签栏、侧栏、系统界面和窗口大小都会占用空间。" },
      { signal: "设备像素比大于 1", meaning: "一个 CSS 像素由多个设备像素绘制，这在高 DPI 屏幕上很常见。" },
    ],
    limitation: "浏览器 API 不能可靠读取显示器型号、物理像素密度或真实刷新率；帧率只是页面回调估计。",
    faqTitle: "分辨率检测常见问题",
    faqs: [
      { question: "为什么 4K 屏幕显示 1920×1080？", answer: "200% 系统缩放会让浏览器以 CSS 像素报告约 1920×1080，但面板仍可能是 4K。" },
      { question: "能检测显示器刷新率吗？", answer: "只能估算浏览器动画回调频率，不能把它当作硬件刷新率测量。" },
      { question: "网页能识别显示器型号吗？", answer: "不能。浏览器出于隐私和兼容性不会公开 EDID 型号信息。" },
    ],
    relatedTitle: "相关工具",
    related: [
      { href: "/monitor-color-calibration", label: "显示器色彩校准" },
      { href: "/screen-tearing-test", label: "屏幕撕裂测试" },
      { href: "/tests/guided", label: "引导式屏幕测试" },
    ],
  },
};

const de: ToolDictionary = {
  "touch-screen-test": {
    title: "Touchscreen-Test",
    seoTitle: "Touchscreen-Test online: tote Zonen und Multitouch prüfen",
    description: "Prüfe Touch-Zonen, Ränder und Multitouch auf Smartphone, Tablet oder Touchmonitor direkt im Browser.",
    keywords: ["Touchscreen Test", "Touch tote Zone", "Multitouch Test"],
    shortName: "Touchscreen",
    modeSummary: "Raster und Multitouch",
    duration: "Etwa 2 Minuten",
    startLabel: "Touch-Test starten",
    toolLabel: "Online-Werkzeug für den Touchscreen-Test",
    howTitle: "So testest du den Touchscreen",
    preparation: ["Reinige das Display und entferne eine störende dicke Schutzfolie.", "Starte Vollbild und ziehe vom Rand und aus allen vier Ecken durch jedes Feld.", "Bewege mehrere Finger gleichzeitig und beobachte die maximale Kontaktzahl.", "Wiederhole leere Stellen zweimal, bevor du sie als tote Zone wertest."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Dieselbe Stelle bleibt wiederholt leer", meaning: "Dort kann eine tote Touch-Zone liegen; Folie, Rahmen oder Gesten können aber ebenfalls stören." },
      { signal: "Die Spur springt plötzlich", meaning: "Die Koordinaten können driften. Reinige das Display und teste ohne Ladegerät erneut." },
      { signal: "Mehrere Finger werden nicht vollständig erkannt", meaning: "Gerät oder Browser könnten die Zahl gleichzeitiger Kontakte begrenzen." },
    ],
    limitation: "Die Seite sieht nur Zeigerereignisse des Browsers. Sie kann weder die Controller-Firmware prüfen noch eine Werkstattdiagnose ersetzen.",
    faqTitle: "Häufige Fragen zum Touchscreen-Test",
    faqs: [
      { question: "Kann ich den Test mit der Maus nutzen?", answer: "Ja, als Vorschau. Eine Maus simuliert aber nur einen Zeiger und beweist keine funktionierende Touch-Eingabe." },
      { question: "Was tun, wenn nach einem Displaytausch der Rand ausfällt?", answer: "Teste zuerst ohne Hülle und Folie. Bleibt die Zone gleich, prüfe Anschluss, Ersatzteil und Einbaudruck." },
      { question: "Werden Ergebnisse hochgeladen?", answer: "Nein. Raster und Ergebnis entstehen nur im aktuellen Browser-Tab." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/screen-resolution-checker", label: "Bildschirmauflösung prüfen" }, { href: "/tests/dead-pixel", label: "Pixelfehler-Test" }, { href: "/tests/guided", label: "Geführter Bildschirmtest" }],
  },
  "hdr-test": {
    title: "HDR-Test online",
    seoTitle: "HDR-Test online: Dynamikumfang und großen Farbraum prüfen",
    description: "Prüfe das gemeldete HDR-Umfeld und untersuche Schatten, Lichter, Local-Dimming-Halos und Farbraumunterschiede.",
    keywords: ["HDR Test", "Monitor HDR Test", "Farbraum Test"],
    shortName: "HDR",
    modeSummary: "3 Testmodi",
    duration: "Etwa 2 Minuten",
    startLabel: "HDR-Test starten",
    toolLabel: "Online-Werkzeug für den HDR-Test",
    howTitle: "So nutzt du den HDR-Test",
    preparation: ["Aktiviere HDR im Betriebssystem und verschiebe das Fenster auf den richtigen Monitor.", "Wechsle im Vollbild zwischen Erkennung, Dynamikumfang und großem Farbraum.", "Prüfe Schwarz- und Weißabstufungen in einem eher dunklen Raum.", "Vergleiche sRGB und große Farbräume, ohne das Monitorprofil zu wechseln."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Die dunkelsten Stufen verschmelzen mit Schwarz", meaning: "Schwarzpegel, Gamma, Ausgabebereich oder Local Dimming können Schatten verschlucken." },
      { signal: "Die hellsten Stufen sehen identisch aus", meaning: "Tone Mapping oder Kontrast können Spitzlichter beschneiden." },
      { signal: "Um das kleine weiße Feld liegt ein Schein", meaning: "Das kann Blooming der lokalen Dimmung bei LCD oder Mini LED sein." },
    ],
    limitation: "Eine Webseite misst keine Nits, Schwarzwerte, Panel-Bittiefe oder HDR-Zertifizierung. Sie zeigt Browsersignale und Sichtmuster.",
    faqTitle: "Häufige Fragen zum HDR-Test",
    faqs: [
      { question: "Warum wird SDR gemeldet, obwohl mein Monitor HDR kann?", answer: "Prüfe System-HDR, den verwendeten Monitor, Kabel, GPU-Ausgabe und Browserunterstützung." },
      { question: "Kann die Webseite Spitzenhelligkeit messen?", answer: "Nein. Dafür braucht man ein Messgerät und kontrollierte Testbilder." },
      { question: "Erkennt der Test HDR10 oder Dolby Vision?", answer: "Nein. Der Browser meldet nur ein HDR-Umfeld, nicht das konkrete Videoformat." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/tests/color", label: "Monitor-Farbtest" }, { href: "/tests/gradient", label: "Banding-Test" }, { href: "/tests/backlight-bleed", label: "Backlight-Bleeding-Test" }],
  },
  "screen-tearing-test": {
    title: "Screen-Tearing-Test",
    seoTitle: "Screen-Tearing-Test online für VSync, FreeSync und G-Sync",
    description: "Vergleiche VSync, variable Bildwiederholrate und Frame-Limits mit bewegten Streifen, Ebenen und einem Schachbrett.",
    keywords: ["Screen Tearing Test", "VSync Test", "FreeSync Test"],
    shortName: "Screen Tearing",
    modeSummary: "3 Bewegungsmuster",
    duration: "Etwa 2 Minuten",
    startLabel: "Tearing-Test starten",
    toolLabel: "Online-Werkzeug für den Screen-Tearing-Test",
    howTitle: "So testest du auf Screen Tearing",
    preparation: ["Starte im Vollbild mit schnellen Streifen und beobachte scharfe Kanten.", "Wechsle zu Ebenen und Schachbrett und suche erneut nach einem horizontalen Versatz.", "Vergleiche deine aktuellen Einstellungen mit VSync, FreeSync, G-Sync oder Frame-Limit.", "Lass Browserzoom, Bildwiederholrate und Monitor zwischen den Durchgängen unverändert."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Ein horizontaler Abschnitt ist seitlich versetzt", meaning: "Das entspricht Tearing: verschiedene Bildschirmteile zeigen unterschiedliche Zeitpunkte." },
      { signal: "Das ganze Muster stoppt oder springt", meaning: "Das deutet eher auf ausgelassene Frames oder Ruckeln hin." },
      { signal: "Bewegte Kanten ziehen dunkle oder helle Spuren", meaning: "Das ist Ghosting oder Overdrive-Overshoot, kein Tearing." },
    ],
    limitation: "Browser synchronisieren die Seitenkomposition meist selbst. Der Test kann VSync nicht abschalten oder VRR zertifizieren; prüfe zusätzlich im betroffenen Spiel.",
    faqTitle: "Häufige Fragen zu Screen Tearing",
    faqs: [
      { question: "Warum läuft der Browsertest glatt, das Spiel aber nicht?", answer: "Browser und Spiel nutzen unterschiedliche Vollbild-, Bildraten- und Synchronisationspfade." },
      { question: "Beseitigt eine hohe Bildwiederholrate Tearing vollständig?", answer: "Nein. Der Versatz ist kürzer sichtbar, unsynchronisierte Frames können aber weiterhin reißen." },
      { question: "Wie unterscheide ich Tearing, Ruckeln und Ghosting?", answer: "Tearing ist ein horizontaler Versatz, Ruckeln stoppt das ganze Bild, Ghosting hinterlässt eine Spur." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/tests/motion", label: "Monitor-Ghosting-Test" }, { href: "/tests/guided", label: "Geführter Bildschirmtest" }, { href: "/hdr-test", label: "HDR-Test online" }],
  },
  "monitor-color-calibration": {
    title: "Monitorkalibrierung",
    seoTitle: "Monitor online kalibrieren: Schwarz, Weiß, Gamma und Farben",
    description: "Stelle Schwarz- und Weißpegel, neutrale Graustufen, Gamma 2,2 und Farbtrennung mit Browser-Testbildern ein.",
    keywords: ["Monitor kalibrieren", "Farbkalibrierung", "Gamma 2.2 Test"],
    shortName: "Farbkalibrierung",
    modeSummary: "4 Kalibrierschritte",
    duration: "Etwa 5 Minuten",
    startLabel: "Kalibrierung starten",
    toolLabel: "Online-Werkzeug zur Monitorkalibrierung",
    howTitle: "So führst du die Sichtkalibrierung durch",
    preparation: ["Lass den Monitor 20 Minuten warm werden und deaktiviere Nachtmodus sowie dynamischen Kontrast.", "Wähle einen passenden SDR-Modus und beginne mit Helligkeit und Kontrast.", "Prüfe Schwarz/Weiß, neutrale Graustufen, Gamma 2,2 und Farbtrennung.", "Ändere jeweils nur eine OSD-Einstellung und notiere den Ausgangswert."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Dunkle Felder verschwinden vollständig", meaning: "Schwarzpegel oder Ausgabebereich können zu niedrig eingestellt sein." },
      { signal: "Helle Felder verschmelzen mit Weiß", meaning: "Zu hoher Kontrast kann Spitzlichter beschneiden." },
      { signal: "Graustufen wirken rot, grün oder blau", meaning: "Weißabgleich oder Farbtemperatur können verschoben sein." },
    ],
    limitation: "Das ist eine Sichtanpassung. Sie erstellt kein ICC-Profil und misst kein Delta E; dafür brauchst du ein Messgerät.",
    faqTitle: "Häufige Fragen zur Monitorkalibrierung",
    faqs: [
      { question: "Kann eine Webseite den Monitor wirklich kalibrieren?", answer: "Sie liefert stabile Muster für das OSD, misst aber nicht das Licht des Panels." },
      { question: "Welches Gamma passt für SDR?", answer: "Gamma 2,2 ist ein üblicher Ausgangspunkt. Professionelle Arbeit folgt dem jeweiligen Zielstandard." },
      { question: "Soll HDR vorher aus sein?", answer: "Für SDR-Kalibrierung ja, damit Tone Mapping und dynamische Verbesserungen das Muster nicht verändern." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/tests/grayscale", label: "Graustufen-Test" }, { href: "/tests/gradient", label: "Banding-Test" }, { href: "/tests/color", label: "Monitor-Farbtest" }],
  },
  "oled-burn-in-test": {
    title: "OLED-Einbrenntest",
    seoTitle: "OLED-Einbrenntest: Nachbilder und Gleichmäßigkeit prüfen",
    description: "Prüfe OLED-Einbrennen, vorübergehende Nachbilder und Gleichmäßigkeit mit Vollfarben, dunklem Grau, bewegten Balken und Verläufen.",
    keywords: ["OLED Burn In Test", "OLED Einbrennen", "OLED Nachbild"],
    shortName: "OLED-Einbrennen",
    modeSummary: "4 schonende Muster",
    duration: "Maximal 5 Minuten",
    startLabel: "OLED-Test starten",
    toolLabel: "Werkzeug für OLED-Einbrennen und Nachbilder",
    howTitle: "So prüfst du OLED sicher",
    preparation: ["Zeige zuerst einige Minuten normale bewegte Inhalte und dimme den Raum.", "Prüfe im Vollbild Vollfarben sowie 1–10 % Grau.", "Suche nach festen Logos, Taskleisten oder Fensterkonturen.", "Der Test stoppt nach fünf Minuten. Lass kein Muster unnötig lange stehen."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Eine feste Kontur bleibt in mehreren Farben sichtbar", meaning: "Das spricht eher für dauerhaftes Einbrennen." },
      { signal: "Dunkles Grau zeigt Streifen oder Flecken", meaning: "Das kann eine typische Near-Black-Ungleichmäßigkeit des OLED-Panels sein." },
      { signal: "Die Spur verschwindet nach normalen Inhalten", meaning: "Das passt eher zu vorübergehender Bildspeicherung." },
    ],
    limitation: "Der Sichttest misst keine Pixelalterung und entscheidet nicht über Garantie. Versuche nicht, Einbrennen mit langen statischen Mustern zu reparieren.",
    faqTitle: "Häufige Fragen zu OLED-Einbrennen",
    faqs: [
      { question: "Was unterscheidet Einbrennen und Nachbild?", answer: "Ein Nachbild verschwindet meist wieder; Einbrennen bleibt über Farben und Testdurchgänge hinweg an derselben Stelle." },
      { question: "Soll ich eine manuelle Pixelreinigung starten?", answer: "Befolge die Herstellerangaben. Eine tiefe manuelle Reinigung ist Wartung und sollte nicht ständig laufen." },
      { question: "Funktioniert der Test auch auf LCD?", answer: "Die Muster zeigen auch dort Nachbilder und Gleichmäßigkeit, die Hinweise richten sich aber vor allem an OLED." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/tests/grayscale", label: "Graustufen-Test" }, { href: "/tests/color", label: "Monitor-Farbtest" }, { href: "/tests/backlight-bleed", label: "Backlight-Bleeding-Test" }],
  },
  "screen-resolution-checker": {
    title: "Bildschirmauflösung prüfen",
    seoTitle: "Bildschirmauflösung online prüfen: Viewport, Pixeldichte und Seitenverhältnis",
    description: "Sieh gemeldete Bildschirmgröße, Viewport, Geräte-Pixelverhältnis, Seitenverhältnis, Ausrichtung und Farbtiefe live.",
    keywords: ["Bildschirmauflösung prüfen", "Viewport Test", "Device Pixel Ratio"],
    shortName: "Auflösung",
    modeSummary: "Live-Browserwerte",
    duration: "Sofortiges Ergebnis",
    startLabel: "Auflösungsprüfung öffnen",
    toolLabel: "Online-Werkzeug zur Prüfung der Bildschirmauflösung",
    howTitle: "So liest du die Auflösungswerte",
    preparation: ["Verschiebe das Fenster auf den gewünschten Monitor und warte kurz.", "Vergleiche im Vollbild Bildschirmangabe und Viewport mit der Systemskalierung.", "Drehe das Mobilgerät oder ändere die Fenstergröße und beobachte die Live-Werte.", "Notiere Skalierung, Pixelverhältnis und Browserumgebung für die Fehlersuche."],
    lookTitle: "Darauf solltest du achten",
    observations: [
      { signal: "Die gemeldete Auflösung ist kleiner als die Panelspezifikation", meaning: "Systemskalierung und CSS-Pixel können den Browserwert verkleinern, ohne die physischen Pixel zu ändern." },
      { signal: "Der Viewport ist kleiner als der Bildschirm", meaning: "Browserleisten, Betriebssystem und Fenstergröße belegen Platz." },
      { signal: "Das Geräte-Pixelverhältnis ist größer als 1", meaning: "Mehrere Gerätepixel zeichnen einen CSS-Pixel; das ist bei HiDPI normal." },
    ],
    limitation: "Browser-APIs lesen weder Monitormodell noch physische Pixeldichte oder echte Bildwiederholrate zuverlässig aus.",
    faqTitle: "Häufige Fragen zur Auflösung",
    faqs: [
      { question: "Warum meldet ein 4K-Monitor 1920×1080?", answer: "Bei 200 % Skalierung meldet der Browser ungefähr 1920×1080 CSS-Pixel, obwohl das Panel weiterhin 4K haben kann." },
      { question: "Kann die Seite die Bildwiederholrate messen?", answer: "Sie schätzt nur Browser-Animationsaufrufe und ersetzt keine Hardwaremessung." },
      { question: "Kann eine Webseite das Monitormodell erkennen?", answer: "Nein. Browser geben EDID-Modellinformationen aus Datenschutz- und Kompatibilitätsgründen nicht frei." },
    ],
    relatedTitle: "Passende Werkzeuge",
    related: [{ href: "/monitor-color-calibration", label: "Monitorkalibrierung" }, { href: "/screen-tearing-test", label: "Screen-Tearing-Test" }, { href: "/tests/guided", label: "Geführter Bildschirmtest" }],
  },
};

export function getStandaloneToolCopy(locale: Locale, slug: StandaloneToolSlug) {
  if (locale === "en") {
    throw new Error("English standalone tools use their full editorial pages.");
  }
  return (locale === "zh" ? zh : de)[slug];
}
