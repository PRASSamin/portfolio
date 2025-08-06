import NavigationBar from "@/components/NavigationBar";
import AdminSidebar from "./components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/utils/get-user";

const AdminRoot = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUser();
  return (
    <div className="bg-background max-h-screen overflow-hidden">
      <NavigationBar />
      <AdminSidebar user={user!}>
        <main className="px-4 py-3 overflow-auto max-h-[calc(100vh-64px)] w-full scrollbar-auto">
          {children}
        </main>
      </AdminSidebar>
      <Toaster />
    </div>
  );
};

export default AdminRoot;
