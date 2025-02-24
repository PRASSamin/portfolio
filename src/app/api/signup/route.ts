import { NextResponse, NextRequest } from "next/server";
import { StreamChat } from "stream-chat";
import { clerkClient } from "@clerk/nextjs/server";
import { Client } from "@botpress/chat";

const api_key = process.env.NEXT_STREAM_API_KEY!;
const api_secret = process.env.NEXT_STREAM_API_SECRET!;

export async function POST(request: NextRequest) {
  const { data: user } = await request.json();
  const client = await clerkClient();
  const bpClient = new Client({
    webhookId: process.env.NEXT_PUBLIC_BOTPRESS_WEBHOOK_ID!,
  });

  const chatClient = StreamChat.getInstance(api_key, api_secret);
  const token = chatClient.createToken(user.id);
  const { key } = await bpClient.createUser({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    pictureUrl: user.image_url,
    profile: JSON.stringify({
      email: user?.email_addresses?.[0]?.email_address,
    }),
  });

  await client.users.updateUserMetadata(user.id, {
    publicMetadata: {
      chatToken: token,
      novaToken: key,
    },
  });

  if (
    user.email_addresses[0].email_address ===
      process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
    user.username === process.env.NEXT_PUBLIC_ADMIN_USERNAME
  ) {
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "admin",
      },
    });
  }

  return NextResponse.json({
    success: true,
  });
}
