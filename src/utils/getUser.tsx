import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants";
import jwt from "jsonwebtoken";
import { AUTH_PUBLIC_KEY } from "@/constants/env";
import { UserType } from "@/types";

export const getUser = async () => {
  let user: UserType | null;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    user = null;
  } else {
    user = jwt.verify(token, AUTH_PUBLIC_KEY) as UserType;
  }

  return user;
};
