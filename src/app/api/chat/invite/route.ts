import { NextRequest, NextResponse } from "next/server";
import { InviteTokenGenerator } from "./handlers";
import { db } from "@/utils/db";
import { decodeToken } from "@/utils/tokenizer";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const { status, success, id, message } = await InviteTokenGenerator(token);
  if (status === 200) {
    return NextResponse.json({ success, id }, { status });
  } else {
    return NextResponse.json({ success, message }, { status });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  const inviteDetails: { id: string; token: string } | null =
    await db.chatInvite.findUnique({
      where: {
        id: id,
      },
    });

  const decodedData = inviteDetails?.token
    ? decodeToken(inviteDetails.token)
    : null;

  if (!decodedData) {
    return NextResponse.json(
      { success: false, message: "Invite link is expired" },
      { status: 400 }
    );
  }

  return NextResponse.json(decodedData, { status: 200 });
}
