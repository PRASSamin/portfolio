import { db } from "@/lib/db";

export const InviteTokenGenerator = async (token: string) => {
  try {
    const invite = await db.chatInvite.create({
      data: {
        token: token,
      },
    });

    return {
      success: true,
      id: invite.id,
      status: 201,
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
