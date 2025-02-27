import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { clerkClient } from "@clerk/nextjs/server";
import { encodeToken } from "@/lib/tokenizer";
import { InviteTokenGenerator } from "../../chat/invite/handlers";
import { toCapitalize } from "@/lib/utils";

const api_key = process.env.NEXT_STREAM_API_KEY!;
const api_secret = process.env.NEXT_STREAM_API_SECRET!;
const admin_email = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export async function POST(request: NextRequest) {
  try {
    const { data: user } = await request.json();
    const clerk = await clerkClient();
    if (!user?.email_addresses?.length) {
      return NextResponse.json(
        { message: "Invalid user data" },
        { status: 400 }
      );
    }

    const client = StreamChat.getInstance(api_key, api_secret);

    const { data } = await clerk.users.getUserList({
      emailAddress: [admin_email, user.email_addresses[0]?.email_address],
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

    if (admin.id === vUser.id) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const userObj = {
      id: vUser.id,
      name: `${vUser.firstName || ""} ${vUser.lastName || ""}`.trim(),
      image: vUser.imageUrl,
    };

    const channels = await client.queryChannels({
      type: "messaging",
      members: { $in: [vUser.id] },
    });

    if (channels.some((channel) => channel.id === user.id)) {
      return NextResponse.json(
        { message: "Channel already exists" },
        { status: 200 }
      );
    }

    const inviteData = {
      chatToken: client.createToken(vUser.id),
      user: userObj,
      channelId: vUser.id,
    };

    const inviteToken = encodeToken(inviteData);
    const { id: invId } = await InviteTokenGenerator(inviteToken);
    if (!invId) {
      return NextResponse.json(
        { message: "Failed to generate invite token" },
        { status: 500 }
      );
    }

    const channel = client.channel("messaging", vUser.id, {
      image: vUser.imageUrl,
      created_by_id: vUser.id,
      name: `${toCapitalize(vUser?.firstName || "")}'s Inbox`,
      members: [vUser.id, admin.id],
      metadata: {
        inviteToken: invId,
      },
    });

    await channel.create();

    return NextResponse.json(
      { message: "Channel created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
