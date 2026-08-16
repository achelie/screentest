import type { Locale } from "@/lib/i18n";

export const STATE_MESSAGES = {
  en: {
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
  zh: {
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
} as const satisfies Record<Locale, Record<string, string>>;
