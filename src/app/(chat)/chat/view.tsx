"use client";
import React, { useState, useEffect } from "react";
import { useCreateChatClient } from "stream-chat-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MyUser, StreamChannel } from "@/types";
import { toCapitalize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { encodeToken } from "@/lib/tokenizer";
import LoadingAnimation from "@/app/(chat)/components/loader";
import ChatSideBar from "../components/ChatSideBar";
import { useChat } from "@/app/context/ChatProvider";
import ChattingArea from "../components/ChattingArea";

import "stream-chat-react/dist/css/v2/index.css";
import axios from "axios";

type Props = {
  user: MyUser;
  admin: MyUser;
  apiKey: string;
};

const ChatPageView = ({ user, admin, apiKey }: Props) => {
  const { setActiveChannel, setChannels } = useChat();
  const router = useRouter();
  const [isTimeout, setIsTimeout] = useState(false);

  const userObj = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}` || "",
    image: user.imageUrl,
  };

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: user.publicMetadata.chatToken,
    userData: userObj,
  });

  // Fetch Channels for Admin
  useEffect(() => {
    if (!client || admin.id !== user.id) return;

    const fetchChannels = async () => {
      try {
        const result: StreamChannel[] = await client.queryChannels({
          type: "messaging",
          members: { $in: [admin.id] },
        });
        setChannels(result);
        if (result.length > 0) setActiveChannel(result[0]);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, [client, admin.id, user.id]);

  // Setup Chat for Non-Admin Users
  useEffect(() => {
    if (!client || admin.id === user.id) return;

    const fetchChannels = async () => {
      try {
        // Check if the user is already in any channels
        const result = await client.queryChannels({
          type: "messaging",
          members: { $in: [user.id] },
        });

        if (
          result.length > 0 &&
          result.filter((channel) => channel.id === user.id).length > 0
        ) {
          setChannels(result);
          setActiveChannel(result[0]);
        } else {
          const inviteData = {
            chatToken: user.publicMetadata.chatToken,
            user: {
              id: user.id,
              name: `${user.firstName} ${user.lastName}` || "",
              image: user.imageUrl,
            },
            channelId: user.id,
          };

          // Create global invite url of the channel
          const inviteToken = encodeToken(inviteData);
          const inviteDetails = await axios.post("/api/chat/invite", {
            token: inviteToken,
          });
          const inviteId = inviteDetails.data.id;

          // Create a new chat channel
          const chatChannel: StreamChannel = client.channel(
            "messaging",
            user.id,
            {
              image: user.imageUrl,
              name: `${toCapitalize(user?.firstName || "")}'s Inbox`,
              members: [user.id, admin.id],
              metadata: {
                inviteToken: inviteId,
              },
            }
          );

          setActiveChannel(chatChannel);
        }
      } catch (error) {
        console.error("Error fetching or creating channels:", error);
      }
    };

    fetchChannels();
  }, [admin, client, user]);

  // Handle incoming new messages and trigger push notifications
  useEffect(() => {
    if (client) {
      client.on("message.new", (event) => {
        router.refresh();

        // Ignore messages sent by the current user
        if (event.message?.user?.id === user.id) return;

        // Request permission to show notifications
        if (Notification.permission === "default") {
          Notification.requestPermission().catch(() => {
            console.error("Error requesting notification permission");
          });
        }

        // Show notification
        if (Notification.permission === "granted") {
          new Notification(`New message`, {
            body: event.message?.text,
            icon:
              String(event.message?.user?.image) ||
              `${window.location.origin}/favicon.ico`,
            data: JSON.stringify({ url: window.location.href }),
          });
        }
      });
    }
  }, [client, user.id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!client) {
      timeout = setTimeout(() => {
        setIsTimeout(true);
      }, 7000); // 15s
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [client]);

  if (!client) {
    return (
      <div className="fixed bg-background inset-0 z-[9999] flex justify-center items-center">
        <LoadingAnimation />
        {isTimeout && (
          <div className="absolute bottom-10 flex flex-col items-center">
            <p className="text-white font-bold text-sm mb-2">
              Loading is taking longer than expected.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ChatSideBar user={user} admin={admin} />
      <ChattingArea client={client} user={user} admin={admin} />
    </SidebarProvider>
  );
};

export default ChatPageView;
