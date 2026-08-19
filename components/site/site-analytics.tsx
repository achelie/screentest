import Script from "next/script";

const AHREFS_ANALYTICS_KEY = "BIpugYY//fqlVBKk5l1Erg";

export function SiteAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      <Script
        async
        data-key={AHREFS_ANALYTICS_KEY}
        src="https://analytics.ahrefs.com/analytics.js"
        strategy="afterInteractive"
      />
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}
    </>
  );
}
