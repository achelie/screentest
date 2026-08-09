import Link from "@/components/site/no-prefetch-link";
import { SiteLogo } from "@/components/site/site-logo";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <SiteLogo />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/tests">Tests</Link>
          <Link href="/guides">Guides</Link>
          <Link className="nav-start" href="/tests/guided">
            Start check
          </Link>
        </nav>
      </div>
    </header>
  );
}
