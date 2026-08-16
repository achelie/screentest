import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | ScreenTestHub",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="site-main" id="main-content">
          <div className="page-shell not-found">
            <p className="not-found-code">ERROR / 404</p>
            <h1>This pixel is outside the panel.</h1>
            <p>That page moved, disappeared, or never existed.</p>
            <div className="button-row">
              <a className="button-primary" href="/tests">Open all tests</a>
              <a className="button-secondary" href="/">Back home</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
