"use client";
import { useState, useEffect } from "react";
import { useCreateChatClient } from "stream-chat-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MyUser } from "@/types";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/(chat)/components/loader";
import ChatSideBar from "../components/ChatSideBar";
import { useChat } from "@/app/context/ChatProvider";
import ChattingArea from "../components/ChattingArea";

import "stream-chat-react/dist/css/v2/index.css";

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

  useEffect(() => {
    if (!client || !user.id) return;

    const fetchChannels = async () => {
      try {
        // Check if the user is already in any channels
        const channels = await client.queryChannels({
          type: "messaging",
          members: { $in: [user.id] },
        });

        if (channels.length > 0) {
          setChannels(channels);
          setActiveChannel(channels[0]);
        }
      } catch (error) {
        console.error("Error fetching or creating channels:", error);
      }
    };

    fetchChannels();
  }, [client, user?.id]);

  // Handle incoming new messages and trigger push notifications
  useEffect(() => {
    if (client) {
      client.on("notification.added_to_channel", (event) => {
        router.refresh();
      });

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
