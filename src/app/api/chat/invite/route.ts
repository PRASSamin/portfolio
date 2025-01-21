import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const inviteId = crypto.randomUUID().replaceAll("-", "").substring(0, 15);

    await db.chatInvite.create({
      data: {
        id: inviteId,
        token: token,
      },
    });

    return NextResponse.json({
      success: true,
      id: inviteId,
    });
  } catch (error: any) {
    console.error("Error occurred:", error.message || error);
    console.error("Stack trace:", error.stack || "No stack trace available");

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}