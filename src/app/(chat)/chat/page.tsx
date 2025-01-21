import ChatPageView from "./view";
import { createClerkClient } from "@clerk/backend";
import { currentUser } from "@clerk/nextjs/server";
import { MyUser } from "@/types";
import { metatag } from "@/lib/metatag";

const clerk_secret = process.env.CLERK_SECRET_KEY!;
const stream_api_key = process.env.NEXT_STREAM_API_KEY!;

const getAdmin = async () => {
  const clerkClient = createClerkClient({ secretKey: clerk_secret });

  const { data: fullAdminData } = await clerkClient.users.getUserList({
    emailAddress: [process.env.NEXT_PUBLIC_ADMIN_EMAIL!],
  });

  return fullAdminData[0];
};

export default async function Page() {
  const user: MyUser | null = await currentUser();
  const admin: MyUser | null = await getAdmin();

  return (
    <ChatPageView
      user={JSON.parse(JSON.stringify(user))}
      admin={JSON.parse(JSON.stringify(admin))}
      apiKey={stream_api_key}
    />
  );
}

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Chat | PRAS Samin",
    robots: "noindex, nofollow",
  });
};
