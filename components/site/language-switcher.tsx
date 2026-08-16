"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import Link from "@/components/site/no-prefetch-link";
import type { Locale, NavigationMessages } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
  messages: NavigationMessages;
  mobile?: boolean;
};

function languagePath(pathname: string, target: Locale) {
  const englishPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";

  if (target === "en") return englishPath;
  if (englishPath === "/touch-screen-test") return "/zh/tests";
  if (/^\/guides\/[^/]+/.test(englishPath)) return "/zh/guides";
  return englishPath === "/" ? "/zh" : `/zh${englishPath}`;
}

export function LanguageSwitcher({ locale, messages, mobile = false }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const handleSwitch = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    if (target === locale) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `screen_test_locale=${target}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
    const targetPath = languagePath(window.location.pathname, target);
    window.location.assign(`${targetPath}${window.location.search}${window.location.hash}`);
  };

  return (
    <div
      aria-label={messages.language}
      className={mobile ? "language-switcher language-switcher-mobile" : "language-switcher"}
      role="group"
    >
      {mobile ? <span className="language-switcher-label">{messages.language}</span> : null}
      <span className="language-options">
        <Link
          aria-current={locale === "en" ? "page" : undefined}
          aria-label={messages.switchToEnglish}
          data-active={locale === "en"}
          href={languagePath(pathname, "en")}
          lang="en"
          onClick={(event) => handleSwitch(event, "en")}
        >
          EN
        </Link>
        <span aria-hidden="true" className="language-divider">/</span>
        <Link
          aria-current={locale === "zh" ? "page" : undefined}
          aria-label={messages.switchToChinese}
          data-active={locale === "zh"}
          href={languagePath(pathname, "zh")}
          lang="zh-CN"
          onClick={(event) => handleSwitch(event, "zh")}
        >
          中文
        </Link>
      </span>
    </div>
  );
}
