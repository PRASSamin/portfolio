import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Theme } from "../context/ThemeProvider";
import { poppins } from "@/utils/fonts";
import "./auth.css";
export { metadata } from "@/app/layout";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Theme>
        <html
          style={{ scrollBehavior: "smooth", overflowX: "hidden" }}
          lang="en"
          suppressHydrationWarning={true}
        >
          <body className={`${poppins.className} antialiased bg-background`}>
            <div className="fixed hidden dark:block -top-[20%]  sm:-top-[50%] z-0 -rotate-[35deg]">
              <img
                className=" shadow-black/5  rounded-large"
                src={"/purple.png"}
                alt="gradient"
              />
            </div>
            <div className="w-full backdrop-blur-[50px] dark:bg-black/30 bg-white fixed top-0 left-0 h-screen z-[1]" />
            <main className="w-screen h-screen z-20 relative">{children}</main>
          </body>
        </html>
      </Theme>
    </ClerkProvider>
  );
}
