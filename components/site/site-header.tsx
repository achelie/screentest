import { SiteNavigation } from "@/components/site/site-navigation";
import { SiteLogo } from "@/components/site/site-logo";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getTestRoutes } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLogo locale={locale} homeLabel={dictionary.common.logoHome} />
        <SiteNavigation
          locale={locale}
          messages={dictionary.common.nav}
          tools={getTestRoutes(locale)}
        />
      </div>
    </header>
  );
}
