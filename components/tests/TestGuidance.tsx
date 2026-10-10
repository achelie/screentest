import type { ReactNode } from "react";

import Link from "@/components/site/no-prefetch-link";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { getTestGuidance, GUIDANCE_LABELS, type TestGuidanceId } from "@/lib/test-guidance";

import styles from "./TestGuidance.module.css";

const SECTIONS = [
  { id: "test-how", label: "how" },
  { id: "test-normal", label: "normal" },
  { id: "test-results", label: "results" },
  { id: "test-troubleshooting", label: "troubleshooting" },
] as const;

export function TestGuidanceNav({ locale }: { locale: Locale }) {
  const labels = GUIDANCE_LABELS[locale];
  return (
    <nav aria-label={labels.navLabel} className={styles.navigation} data-test-guide-nav>
      {SECTIONS.map(({ id, label }) => <a href={`#${id}`} key={id}>{labels[label]}</a>)}
    </nav>
  );
}

export function TestGuidanceContent({ locale, testId, resultExtras }: {
  locale: Locale;
  testId: TestGuidanceId;
  resultExtras?: ReactNode;
}) {
  const labels = GUIDANCE_LABELS[locale];
  const guidance = getTestGuidance(locale, testId);
  return (
    <div className={styles.sections} data-test-guidance={testId}>
      <section aria-labelledby="test-how-title" className={styles.section} id="test-how">
        <h2 id="test-how-title">{labels.how}</h2>
        <ol className={styles.steps}>{guidance.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
      <section aria-labelledby="test-normal-title" className={styles.section} id="test-normal">
        <h2 id="test-normal-title">{labels.normal}</h2>
        <p className={styles.note}>{labels.normalNote}</p>
        <ul className={styles.list}>{guidance.normal.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section aria-labelledby="test-results-title" className={styles.section} id="test-results">
        <h2 id="test-results-title">{labels.results}</h2>
        <dl className={styles.results}>{guidance.results.map(({ signal, meaning }) => (
          <div key={signal}><dt>{signal}</dt><dd>{meaning}</dd></div>
        ))}</dl>
        <p className={styles.limitation}>{guidance.limitation}</p>
        {resultExtras}
      </section>
      <section aria-labelledby="test-troubleshooting-title" className={styles.section} id="test-troubleshooting">
        <h2 id="test-troubleshooting-title">{labels.troubleshooting}</h2>
        <ol className={styles.steps}>{guidance.troubleshooting.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>
    </div>
  );
}

export function TestHomeLink({ locale }: { locale: Locale }) {
  return <div className={styles.home} data-test-home><Link href={localizePath("/", locale)}>{GUIDANCE_LABELS[locale].home}</Link></div>;
}

export function TestHomeBreadcrumb({ locale, name }: { locale: Locale; name: string }) {
  const { common } = getDictionary(locale);
  return (
    <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
      <Link href={localizePath("/", locale)}>{common.home}</Link><span aria-hidden="true">/</span>
      <Link href={localizePath("/tests", locale)}>{common.screenTests}</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{name}</span>
    </nav>
  );
}
