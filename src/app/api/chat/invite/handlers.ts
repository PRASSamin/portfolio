import { db } from "@/lib/db";

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
