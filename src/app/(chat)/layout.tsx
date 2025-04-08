import "../globals.css";
import ChatNavBar from "./components/nav";
import { poppins } from "@/utils/fonts";
import { ChatProvider } from "@/context/ChatProvider";
import GoogleAnaProvider from "@/context/AnalyticsProvider";
export { metadata } from "../layout";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <html
        className="no-scrollbar overflow-x-hidden scroll-smooth"
        lang="en"
        suppressHydrationWarning={true}
      >
        <GoogleAnaProvider>
          <body
            className={`${poppins.className} antialiased overflow-x-hidden`}
          >
            <ChatNavBar />
            <main className="z-20 relative max-h-[calc(100vh-64px)]">
              {children}
            </main>
          </body>
        </GoogleAnaProvider>
      </html>
    </ChatProvider>
  );
}
