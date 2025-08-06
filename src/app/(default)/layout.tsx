import "../globals.css";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Background />
      <NavigationBar />
      <main className="z-20 relative">{children}</main>
      <Footer />
    </>
  );
}
