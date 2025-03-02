import "../globals.css";
import ChatNavBar from "./components/nav";
import { poppins } from "@/utils/fonts";
import { Theme } from "../context/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatProvider } from "@/app/context/ChatProvider";
export { metadata } from "..//layout";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      <ClerkProvider afterSignOutUrl="/">
        <html
          style={{ scrollBehavior: "smooth", overflowX: "hidden" }}
          lang="en"
          suppressHydrationWarning={true}
        >
          <Theme>
            <body className={`${poppins.className} max-h-screen antialiased `}>
              <ChatNavBar />
              <main className="z-20 relative max-h-[calc(100vh-64px)]">
                {children}
              </main>
            </body>
          </Theme>
        </html>
      </ClerkProvider>
    </ChatProvider>
  );
}
