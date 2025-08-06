import { metatag } from "@/utils/metatag";
import AdminMediaView from "./view";

export const generateMetadata = () => {
  return metatag({
    title: "Media | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminMediaPage = async () => {
  return <AdminMediaView />;
};

export default AdminMediaPage;
