import { BASE_URL, GITHUB_AUTH_CLIENT_ID } from "@/constants/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_AUTH_CLIENT_ID}&redirect_uri=${BASE_URL}/signin&response_type=code&scope=read:user+user:email`;
  return NextResponse.redirect(redirectUrl);
}
