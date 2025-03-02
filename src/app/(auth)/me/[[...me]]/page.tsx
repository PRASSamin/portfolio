import UserProfileView from "./view";
import { currentUser } from "@clerk/nextjs/server";
import { metatag } from "@/utils/metatag";

export default async function UserProfilePage() {
  return <UserProfileView />;
}

export const generateMetadata = async () => {
  const user = await currentUser();
  return metatag({
    pageTitle: `${user?.firstName} ${user?.lastName} | PRAS Samin`,
    robots: "index, follow",
  });
};
