import "../globals.css";
import { poppins } from "@/constants/fonts";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/context/AnalyticsProvider";
export { metadata } from "@/app/layout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-[url('/graph.svg')] bg-repeat bg-size-[40px_40px]">
        {children}
      </main>
    </>
  );
}
