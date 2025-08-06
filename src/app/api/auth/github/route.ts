import { GITHUB_AUTH_CLIENT_ID } from "@/constants/env";
import { NextResponse } from "next/server";

export async function GET() {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_AUTH_CLIENT_ID}&redirect_uri=http://localhost:3000/signin&response_type=code&scope=read:user+user:email`;
  return NextResponse.redirect(redirectUrl);
}
