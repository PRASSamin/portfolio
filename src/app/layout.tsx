import "./globals.css";
import { poppins } from "@/constants/fonts";
import { Metadata } from "next";
import { AnalyticsProvider } from "@/context/AnalyticsProvider";
import { RootProvider } from "fumadocs-ui/provider";
import { Suspense } from "react";
import { Progress } from "@/components/Progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import GlobalKeyBinderProvider from "@/context/GlobalKeyBinderProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

const title = "PRAS";
const description =
  "PRAS Samin - a curious developer who’s always building, learning, and exploring what’s possible with code.";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicons/favicon-96x96.png", sizes: "96x96" },
      { url: "/favicons/favicon-192x192.png", sizes: "192x192" },
      { url: "/favicons/favicon-512x512.png", sizes: "512x512" },
      { url: "/favicons/favicon.svg" },
    ],
    shortcut: ["/favicons/favicon.svg"],
    apple: [
      {
        url: "/favicons/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicons/site.webmanifest",
  publisher: "PRAS",
  creator: "PRAS",
  authors: [
    {
      name: "PRAS",
      url: "https://pras.me",
    },
  ],
  appleWebApp: {
    title: "PRAS",
  },
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    creator: "@imprassamin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('_ui_theme') || 'aurora';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;
  return (
    <html
      className="scrollbar-hidden overflow-x-hidden scroll-smooth dark"
      lang="en"
      suppressHydrationWarning={true}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <TooltipProvider>
        <ThemeProvider>
          <body
            className={`${poppins.className} antialiased overflow-x-hidden`}
          >
            <Suspense fallback={null}>
              <Progress />
            </Suspense>
            <Toaster />
            <RootProvider search={{ enabled: false }} theme={{ defaultTheme: "dark", forcedTheme: "dark" }}>
              <GlobalKeyBinderProvider>{children}</GlobalKeyBinderProvider>
            </RootProvider>
            <AnalyticsProvider />
          </body>
        </ThemeProvider>
      </TooltipProvider>
    </html>
  );
}
