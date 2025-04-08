import { NextResponse, NextRequest } from "next/server";
import { StreamChat } from "stream-chat";
import { toCapitalize } from "@/utils";
import { encodeToken } from "@/utils/tokenizer";
import {
  ADMIN_EMAIL,
  STREAM_API_KEY,
  STREAM_API_SECRET,
} from "@/constants/env";
import { nanoid } from "nanoid";
import { db } from "@/utils/db";

export async function POST(request: NextRequest) {
  const { user } = await request.json();
  const uid = nanoid();

  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    return NextResponse.json(
      { message: "Missing Stream API Credentials" },
      { status: 500 }
    );
  }

  const chatClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET, {
    timeout: 15000,
  });
  const token = chatClient.createToken(uid);

  await chatClient.upsertUser({
    id: uid,
    name: user.full_name,
    image: user.avatar ?? undefined,
    role: user.isAdmin ? "admin" : undefined,
    username: user.username,
  });

  if (!user.isAdmin) {
    // Fetch user and admin data
    const admin = await db.user.findUnique({
      where: {
        email: ADMIN_EMAIL,
      },
    });

    // Check if a channel already exists for this user
    const channels = await chatClient.queryChannels({
      type: "messaging",
      id: uid,
    });

    if (channels.some((channel) => channel.id === user.id)) {
      return NextResponse.json(
        { message: "Channel already exists" },
        { status: 200 }
      );
    }

    // Generate invite token
    const inviteData = {
      chatToken: token,
      user: {
        id: uid,
        name: user.full_name,
        image: user.avatar,
      },
      channelId: uid,
    };

    const invite = await db.chatInvite.create({
      data: {
        token: encodeToken(inviteData),
      },
    });

    // Create a new chat channel
    const channel = chatClient.channel("messaging", uid, {
      image: user.avatar,
      created_by_id: uid,
      name: `${toCapitalize(user?.first_name || "")}'s Inbox`,
      members: [uid, admin?.id as string],
      metadata: {
        inviteToken: invite.id,
      },
    });

    await channel.create();
  }
  return NextResponse.json({ success: true, uid, chatToken: token });
}
