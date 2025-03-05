import { NextResponse, NextRequest } from "next/server";
import { StreamChat } from "stream-chat";
import { clerkClient } from "@clerk/nextjs/server";
import { toCapitalize } from "@/utils/utils";
import { encodeToken } from "@/utils/tokenizer";
import { InviteTokenGenerator } from "../chat/invite/handlers";

// Environment variables
const api_key = process.env.NEXT_STREAM_API_KEY!;
const api_secret = process.env.NEXT_STREAM_API_SECRET!;
const admin_email = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
const admin_username = process.env.NEXT_PUBLIC_ADMIN_USERNAME!;

export async function POST(request: NextRequest) {
  const { data: user } = await request.json();
  const clerk = await clerkClient();

  if (!api_key || !api_secret) {
    return NextResponse.json(
      { message: "Missing Stream API keys" },
      { status: 500 }
    );
  }

  const chatClient = StreamChat.getInstance(api_key, api_secret);
  const token = chatClient.createToken(user.id);

  const userEmail = user?.email_addresses?.[0]?.email_address;
  if (!userEmail) {
    return NextResponse.json(
      { message: "Invalid user email" },
      { status: 400 }
    );
  }

  if (!user.username) {
    const username = user?.id
      ?.replace("user_", "")
      ?.replace(/[^a-zA-Z0-9]/g, "");
    try {
      await clerk.users.updateUser(user.id, { username });
    } catch (error) {
      console.error("Failed to update username:", error);
      return NextResponse.json(
        { message: "User update failed" },
        { status: 500 }
      );
    }
  }

  const publicMetadata: Record<string, any> = { chatToken: token };

  // Check if user is admin
  if (userEmail === admin_email && user.username === admin_username) {
    publicMetadata.role = "admin";
  }

  await clerk.users.updateUserMetadata(user.id, { publicMetadata });

  // Fetch user and admin data
  const { data } = await clerk.users.getUserList({
    emailAddress: [admin_email, userEmail],
  });

  const admin = data.find(
    (u) => u.emailAddresses[0]?.emailAddress === admin_email
  );
  const vUser = data.find(
    (u) => u.emailAddresses[0]?.emailAddress !== admin_email
  );

  if (!admin || !vUser) {
    return NextResponse.json(
      { message: "Invalid admin or user" },
      { status: 400 }
    );
  }

  // If the user is the admin, return success
  if (admin.id === vUser.id) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // User object for chat
  const userObj = {
    id: vUser.id,
    name: `${vUser.firstName || ""} ${vUser.lastName || ""}`.trim(),
    image: vUser.imageUrl,
  };

  // Check if a channel already exists for this user
  const channels = await chatClient.queryChannels({
    type: "messaging",
    id: vUser.id,
  });

  if (channels.some((channel) => channel.id === user.id)) {
    return NextResponse.json(
      { message: "Channel already exists" },
      { status: 200 }
    );
  }

  // Generate invite token
  const inviteData = {
    chatToken: chatClient.createToken(vUser.id),
    user: userObj,
    channelId: vUser.id,
  };

  const inviteResponse = await InviteTokenGenerator(encodeToken(inviteData));
  if (!inviteResponse || !inviteResponse.id) {
    return NextResponse.json(
      { message: "Failed to generate invite token" },
      { status: 500 }
    );
  }

  // Create a new chat channel
  const channel = chatClient.channel("messaging", vUser.id, {
    image: vUser.imageUrl,
    created_by_id: vUser.id,
    name: `${toCapitalize(vUser?.firstName || "")}'s Inbox`,
    members: [vUser.id, admin.id],
    metadata: {
      inviteToken: inviteResponse.id,
    },
  });

  await channel.create();
  return NextResponse.json({ success: true });
}
