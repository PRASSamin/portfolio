import "../globals.css";
import { poppins } from "@/utils/fonts";
import { SessionProvider } from "@/context/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import {AnalyticsProvider} from "@/context/AnalyticsProvider";
export { metadata } from "@/app/layout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html
        className="no-scrollbar overflow-x-hidden scroll-smooth"
        lang="en"
        suppressHydrationWarning={true}
      >
        <AnalyticsProvider>
          <body
            className={`${poppins.className} antialiased overflow-x-hidden bg-background`}
          >
            <Toaster />
            <main className="flex min-h-screen items-center justify-center bg-[url('/graph.svg')] bg-repeat bg-[length:40px_40px]">
              {children}
            </main>
          </body>
        </AnalyticsProvider>
      </html>
    </SessionProvider>
  );
}
