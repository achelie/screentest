import Link from "@/components/site/no-prefetch-link";
import { ScanLine } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n";

export function SiteLogo({
  inverted = false,
  locale = "en",
  homeLabel = "ScreenTestHub home",
}: {
  inverted?: boolean;
  locale?: Locale;
  homeLabel?: string;
}) {
  return (
    <Link className="site-logo" href={localizePath("/", locale)} aria-label={homeLabel}>
      <span className="logo-mark" aria-hidden="true">
        <ScanLine size={17} strokeWidth={1.8} />
      </span>
      <span style={inverted ? { color: "var(--paper-strong)" } : undefined}>
        ScreenTestHub
      </span>
    </Link>
  );
}
