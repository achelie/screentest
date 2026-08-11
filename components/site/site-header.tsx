import { SiteNavigation } from "@/components/site/site-navigation";
import { SiteLogo } from "@/components/site/site-logo";
import { TEST_ROUTES } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLogo />
        <SiteNavigation tools={TEST_ROUTES} />
      </div>
    </header>
  );
}
