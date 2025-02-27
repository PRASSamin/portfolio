import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const { status, success, id, message } = await InviteTokenGenerator(token);
  if (status === 200) {
    return NextResponse.json({ success, id }, { status });
  } else {
    return NextResponse.json({ success, message }, { status });
  }
}

export const InviteTokenGenerator = async (token: string) => {
  try {
    const inviteId = crypto.randomUUID().replaceAll("-", "").substring(0, 15);

    await db.chatInvite.create({
      data: {
        id: inviteId,
        token: token,
      },
    });

    return {
      success: true,
      id: inviteId,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error occurred:", error.message || error);
    console.error("Stack trace:", error.stack || "No stack trace available");

    return {
      success: false,
      message: "An error occurred while processing your request.",
      status: 500,
    };
  }
};
