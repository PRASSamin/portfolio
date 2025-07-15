import { metatag } from "@/utils/metatag";
import AdminMembersView from "./view";

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Members | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminMembersPage = async () => {
  return <AdminMembersView />;
};

export default AdminMembersPage;
