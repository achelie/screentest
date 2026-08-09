import Link from "next/link";
import { ScanLine } from "lucide-react";

export function SiteLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className="site-logo" href="/" aria-label="ScreenTestHub home">
      <span className="logo-mark" aria-hidden="true">
        <ScanLine size={17} strokeWidth={1.8} />
      </span>
      <span style={inverted ? { color: "var(--paper-strong)" } : undefined}>
        ScreenTestHub
      </span>
    </Link>
  );
}
