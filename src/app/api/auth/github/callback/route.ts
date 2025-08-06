import {
  ADMIN_EMAIL,
  AUTH_PRIVATE_KEY,
  GITHUB_AUTH_CLIENT_ID,
  GITHUB_AUTH_CLIENT_SECRET,
  NODE_ENV,
} from "@/constants/env";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SESSION_COOKIE_NAME } from "@/constants";
import axios from "axios";

const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";
const EMAILS_URL = "https://api.github.com/user/emails";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Exchange code for access token
  const { data: tbody } = await axios.post(
    TOKEN_URL,
    {},
    {
      headers: { Accept: "application/json" },
      params: {
        client_id: GITHUB_AUTH_CLIENT_ID,
        client_secret: GITHUB_AUTH_CLIENT_SECRET,
        code,
      },
    }
  );

  if (!tbody?.access_token) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get user info
  const { data: emails } = await axios.get(EMAILS_URL, {
    headers: {
      Authorization: `Bearer ${tbody.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  // prepare user info
  const primaryEmail = emails.find((e: any) => e.primary)?.email;

  if (!primaryEmail || primaryEmail !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rawUser } = await axios.get(USER_URL, {
    headers: {
      Authorization: `Bearer ${tbody.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const user = {
    id: rawUser?.id,
    username: rawUser?.login,
    avatar_url: rawUser?.avatar_url,
    name: rawUser?.name,
    email: primaryEmail,
    bio: rawUser?.bio,
    role: "ADMIN",
  };

  const response = NextResponse.json(
    { message: "User signed in successfully" },
    { status: 200 }
  );

  const token = jwt.sign(user, AUTH_PRIVATE_KEY, {
    expiresIn: "7d",
    algorithm: "RS256",
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
