import { createClerkClient } from "@clerk/backend";
import { NextResponse, NextRequest } from "next/server";

const clerk_secret = process.env.CLERK_SECRET_KEY!;

export async function GET(request: NextRequest) {
  const clerkClient = createClerkClient({ secretKey: clerk_secret });

  const { data: admin } = await clerkClient.users.getUserList({
    emailAddress: [process.env.NEXT_PUBLIC_ADMIN_EMAIL!],
  });

  return NextResponse.json(admin[0]);
}
