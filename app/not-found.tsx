import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <p className="not-found-code">ERROR / 404</p>
      <h1>This pixel is outside the panel.</h1>
      <p>That page moved, disappeared, or never existed.</p>
      <div className="button-row">
        <Link className="button-primary" href="/tests">
          Open all tests <ArrowRight size={17} />
        </Link>
        <Link className="button-secondary" href="/">
          Back home
        </Link>
      </div>
    </div>
  );
}
