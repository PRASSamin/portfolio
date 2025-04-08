import UserProfileView from "./view";
import NodeCache from "node-cache";
import { Auth } from "@/utils/auth";
import { cookies } from "next/headers";
import { SessionKey } from "@/config/auth";

const cache = new NodeCache({ stdTTL: 3600 });

const fetchUser = async (): Promise<any> => {
  const cacheKey = "currentUser";
  const cachedData = cache.get<{ user: any; jwe: string }>(cacheKey);
  const cookieStore = await cookies();
  const currentJWE = cookieStore.get(SessionKey)?.value || "";

  if (cachedData && cachedData.jwe === currentJWE) {
    return cachedData.user;
  }

  const { currentUser } = new Auth();
  const user = await currentUser();

  if (user) {
    cache.set(cacheKey, { user, jwe: currentJWE });
  }

  return user;
};

export default async function UserProfilePage() {
  const user = await fetchUser();

  return <UserProfileView user={user} />;
}

export const generateMetadata = async () => {
  const user = await fetchUser();

  return {
    title: user
      ? `${user.first_name} ${user.last_name} | PRAS`
      : "User Profile | PRAS",
    robots: "index, follow",
  };
};
