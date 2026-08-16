"use client";

import type { ChangeEvent } from "react";
import { usePathname } from "next/navigation";

import {
  LOCALES,
  localeConfig,
  localizePath,
  type Locale,
  type NavigationMessages,
} from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
  messages: NavigationMessages;
  mobile?: boolean;
};

function languagePath(pathname: string, target: Locale) {
  const englishPath = pathname.replace(/^\/(?:zh|de)(?=\/|$)/, "") || "/";

  if (target !== "en" && englishPath === "/touch-screen-test") {
    return localizePath("/tests", target);
  }

  if (target !== "en" && /^\/guides\/[^/]+/.test(englishPath)) {
    return localizePath("/guides", target);
  }

  return localizePath(englishPath, target);
}

export function LanguageSwitcher({ locale, messages, mobile = false }: LanguageSwitcherProps) {
  const pathname = usePathname();

  const handleSwitch = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target.value as Locale;
    if (target === locale) return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `screen_test_locale=${target}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
    const targetPath = languagePath(pathname, target);
    window.location.assign(`${targetPath}${window.location.search}${window.location.hash}`);
  };

  return (
    <label className={mobile ? "language-switcher language-switcher-mobile" : "language-switcher"}>
      {mobile ? <span className="language-switcher-label">{messages.language}</span> : null}
      <span className="language-select-shell">
        <select aria-label={messages.language} onChange={handleSwitch} value={locale}>
          {LOCALES.map((candidate) => (
            <option key={candidate} lang={localeConfig[candidate].htmlLang} value={candidate}>
              {localeConfig[candidate].languageName}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
