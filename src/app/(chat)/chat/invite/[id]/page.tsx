import { currentUser } from "@clerk/nextjs/server";
import InviteToChannelView from "./view";
import { MyUser } from "@/types";
import { decodeToken } from "@/lib/tokenizer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const apiKey = process.env.NEXT_STREAM_API_KEY!;

type Props = Promise<{ id: string }>;

const InviteToChannelPage = async ({ params }: { params: Props }) => {
  const { id } = await params;
  const user: MyUser | null = await currentUser();

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
    return notFound();
  }

  const {
    user: owner,
    channelId,
    chatToken,
  } = decodedData as {
    user: {
      id: string;
      name: string;
      image: string;
    };
    channelId: string;
    chatToken: string;
  };

  return (
    <InviteToChannelView
      apiKey={apiKey}
      user={JSON.parse(JSON.stringify(user))}
      ownerObj={owner}
      chatToken={chatToken}
      channelId={channelId}
    />
  );
};

export default InviteToChannelPage;
