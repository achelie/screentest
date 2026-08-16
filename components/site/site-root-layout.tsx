import { SiteAnalytics } from "@/components/site/site-analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getDictionary, localeConfig, type Locale } from "@/lib/i18n";

export function SiteRootLayout({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  const dictionary = getDictionary(locale);

  return (
    <html lang={localeConfig[locale].htmlLang}>
      <body>
        <a className="skip-link" href="#main-content">
          {dictionary.common.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main className="site-main" id="main-content">
          {children}
        </main>
        <SiteFooter locale={locale} />
        <SiteAnalytics />
      </body>
    </html>
  );
}
