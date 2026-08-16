"use client";

import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

import Link from "@/components/site/no-prefetch-link";
import type { Locale } from "@/lib/i18n";
import { STATE_MESSAGES } from "@/lib/state-messages";

function localePath(path: string, locale: Locale) {
  if (locale === "en") return path;
  return path === "/" ? "/zh" : `/zh${path}`;
}

export function LocalizedNotFound({ locale }: { locale: Locale }) {
  const copy = STATE_MESSAGES[locale];
  return (
    <div className="page-shell not-found">
      <p className="not-found-code">{copy.notFoundCode}</p>
      <h1>{copy.notFoundTitle}</h1>
      <p>{copy.notFoundBody}</p>
      <div className="button-row">
        <Link className="button-primary" href={localePath("/tests", locale)}>
          {copy.openTests} <ArrowRight size={17} />
        </Link>
        <Link className="button-secondary" href={localePath("/", locale)}>
          {copy.backHome}
        </Link>
      </div>
    </div>
  );
}

export function LocalizedError({
  error,
  reset,
  locale,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  locale: Locale;
}) {
  const copy = STATE_MESSAGES[locale];
  useEffect(() => console.error(error), [error]);

  return (
    <div className="page-shell not-found">
      <p className="not-found-code">{copy.errorCode}</p>
      <h1>{copy.errorTitle}</h1>
      <p>{copy.errorBody}</p>
      <button className="button-primary" type="button" onClick={reset}>
        {copy.tryAgain}
      </button>
    </div>
  );
}

export function LocalizedLoading({ locale }: { locale: Locale }) {
  const copy = STATE_MESSAGES[locale];
  return (
    <div className="page-shell loading-shell" aria-busy="true" aria-live="polite">
      <span className="sr-only">{copy.loading}</span>
      <div className="loading-grid" aria-hidden="true">
        <div className="loading-copy">
          <span className="loading-line loading-line-short" />
          <span className="loading-line loading-line-title" />
          <span className="loading-line" />
          <span className="loading-line loading-line-medium" />
        </div>
        <div className="loading-panel"><span /><span /><span /></div>
      </div>
    </div>
  );
}
