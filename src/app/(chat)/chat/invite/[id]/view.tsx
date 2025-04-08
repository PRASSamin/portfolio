"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useCreateChatClient } from "stream-chat-react";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { StreamChannel } from "@/types";
import { BetterImage } from "@prass/betterimage/components";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Loader } from "lucide-react";

type Props = {
  apiKey: string;
  user: User;
  ownerObj: {
    id: string;
    name: string;
    image: string;
  };
  channelId: string;
  chatToken: string;
};

const InviteToChannelView = ({
  apiKey,
  user,
  ownerObj,
  chatToken,
  channelId,
}: Props) => {
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: chatToken,
    userData: ownerObj,
  });

  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const fetchChannelData = useCallback(async () => {
    if (!client) return;

    try {
      if (!client.userID) {
        await client.connectUser(ownerObj, chatToken);
      }

      const channelInstance: StreamChannel = client.channel(
        "messaging",
        channelId
      );
      await channelInstance.query();
      setChannel(channelInstance);
    } catch (error) {
      console.error("Failed to fetch channel data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [client, ownerObj, channelId, chatToken]);

  useEffect(() => {
    fetchChannelData();
  }, [fetchChannelData]);

  const addUserToChannel = async () => {
    if (!channel) return;
    setIsJoining(true);

    try {
      await channel.addMembers([user.id]);
      router.push("/chat");
    } catch (error) {
      console.error("Error adding user to the channel:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
        <Loader2Icon className="animate-spin !size-5" />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] flex justify-center items-center">
      <div className="h-[45%] w-[500px] rounded-xl shadow-md shadow-black bg-muted/50 px-6 py-10 flex flex-col items-center justify-between">
        {channel ? (
          <>
            <div className="flex flex-col items-center">
              <div className="relative mb-3 w-16 aspect-square">
                <BetterImage
                  priority
                  className="aspect-square rounded-xl !w-16"
                  src={
                    channel.data?.created_by?.image || ""
                  }
                  width={250}
                  height={250}
                  alt="channel_logo"
                />
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="text-muted-foreground text-sm">
                  You are invited to join
                </span>
                <h1 className="font-bold text-2xl">
                  {channel.data?.created_by?.name?.split(" ")?.[0]}&apos;s Inbox
                </h1>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={addUserToChannel}
              className="h-auto py-3 bg-shaded text-white hover:bg-shaded/50 transition-all duration-150 w-full"
              disabled={isJoining}
            >
              {isJoining ? (
                <Loader2Icon className="animate-spin !size-5" />
              ) : (
                "Join"
              )}
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">Channel data not available.</p>
        )}
      </div>
    </div>
  );
};

export default InviteToChannelView;
