import GoogleAnaProvider from "@/context/AnalyticsProvider";
import "../globals.css";
import { poppins } from "@/utils/fonts";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className="no-scrollbar overflow-x-hidden scroll-smooth"
      lang="en"
      suppressHydrationWarning={true}
    >
      <GoogleAnaProvider>
        <body className={`${poppins.className} antialiased overflow-x-hidden`}>
          {/* Dark Overlay */}
          <div className="w-screen h-screen bg-black fixed inset-0 z-[-1]" />

          {/* Gradient Background with Animation */}
          <div className="fixed inset-0 bg-gradient-to-br from-[#6a00f4] via-[#ff0080] to-[#ff6600] opacity-40 blur-3xl" />

          {/* Glassmorphism Overlay */}
          <div className="fixed inset-0 backdrop-blur-[50px] bg-black/40 z-10" />

          {/* Main Content */}
          <main className="z-20 relative flex items-center justify-center min-h-screen p-6">
            {children}
          </main>
        </body>
      </GoogleAnaProvider>
    </html>
  );
}
