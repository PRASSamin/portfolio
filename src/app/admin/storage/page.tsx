import { metatag } from "@/utils/metatag";
import AdminMediaView from "./view";

export const generateMetadata = () => {
  return metatag({
    title: "Storage | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminMediaPage = async () => {
  return <AdminMediaView />;
};

export default AdminMediaPage;
