import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

const AnalyticsProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-MKRHWX6XVR"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){
            dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', 'G-MKRHWX6XVR', {
            page_path: window.location.pathname,
            });
        `}
      </Script>
      {children}
      <VercelAnalytics />
    </>
  );
};

export { AnalyticsProvider };
