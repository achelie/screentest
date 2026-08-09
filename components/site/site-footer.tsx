import Link from "@/components/site/no-prefetch-link";
import { SiteLogo } from "@/components/site/site-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <SiteLogo inverted />
          <p className="footer-copy">
            Free browser-based screen checks. Nothing gets uploaded, and you do
            not need an account.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/tests">All tests</Link>
          <Link href="/tests/dead-pixel">Dead pixels</Link>
          <Link href="/tests/motion">Motion</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </nav>
        <div className="footer-meta">
          © {new Date().getFullYear()} ScreenTestHub. Built for browsers, not
          repair shops. Results stay on this device.
        </div>
      </div>
    </footer>
  );
}
