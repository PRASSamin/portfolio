import ChatPageView from "./view";
import { metatag } from "@/utils/metatag";
import { Auth } from "@/utils/auth";
import { ADMIN_EMAIL } from "@/constants/env";
import { User } from "@/types";

const stream_api_key = process.env.NEXT_STREAM_API_KEY!;

const getAdmin = async () => {
  const auth = new Auth();
  const data = await auth.getUser({ email: ADMIN_EMAIL });

  return data[0];
};

export default async function Page() {
  const auth = new Auth();
  const user = await auth.currentUser();
  const admin = await getAdmin();

  return (
    <ChatPageView
      user={user as User || null}
      admin={admin || null}
      apiKey={stream_api_key}
    />
  );
}

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Chat | PRAS",
    robots: "noindex, nofollow",
  });
};
