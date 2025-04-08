import NavBar from "../../components/nav";
import AdminSidebar from "./components/sidebar";
import { Toaster } from "@/components/ui/sonner";

const AdminRoot = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-background max-h-screen overflow-hidden">
      <NavBar />
      <AdminSidebar>
        <main className="px-4 py-3 overflow-auto max-h-[calc(100vh-64px)] w-full">
          {children}
        </main>
      </AdminSidebar>
      <Toaster />
    </div>
  );
};

export default AdminRoot;
