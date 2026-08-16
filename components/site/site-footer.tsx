import Link from "@/components/site/no-prefetch-link";
import { SiteLogo } from "@/components/site/site-logo";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const { common } = getDictionary(locale);
  const copy = common.footer;
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <SiteLogo inverted locale={locale} homeLabel={common.logoHome} />
          <p className="footer-copy">{copy.copy}</p>
        </div>
        <nav className="footer-nav" aria-label={copy.label}>
          <Link href={localizePath("/tests", locale)}>{copy.allTests}</Link>
          <Link href={localizePath("/tests/dead-pixel", locale)}>{copy.deadPixels}</Link>
          <Link href={localizePath("/tests/motion", locale)}>{copy.motion}</Link>
          <Link href={localizePath("/guides", locale)}>{copy.guides}</Link>
          <Link href="/sitemap.xml">{copy.sitemap}</Link>
        </nav>
        <div className="footer-meta">
          © {new Date().getFullYear()} ScreenTestHub. {copy.metaPrefix}
        </div>
      </div>
    </footer>
  );
}
