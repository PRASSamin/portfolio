"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Channel as StreamChannel } from "stream-chat";
import { MyUser } from "@/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BetterImage } from "@prass/betterimage/components";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Attachment } from "@mui/icons-material";
import { useChat } from "@/app/context/ChatProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  user: MyUser;
  admin: MyUser;
};

const ChatSideBar = ({ user, admin }: Props) => {
  const { channels, setActiveChannel, activeChannel } = useChat();

  const renderChannelButton = (cnl: StreamChannel) => {
    const lastMessage =
      cnl.state.messageSets[0]?.messages.at(-1)?.text ||
      (cnl.state.messageSets[0]?.messages.at(-1)?.attachments?.length ? (
        <span className="flex gap-1 items-center">
          <Attachment /> Attachment
        </span>
      ) : (
        "No Messages"
      ));

    return (
      <Tooltip key={cnl.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setActiveChannel(cnl)}
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md dark:hover:bg-[#2C2C30] hover:bg-gray-300",
              cnl.id === activeChannel?.id && "bg-gray-300 dark:bg-[#2C2C30]"
            )}
          >
            <div className="flex-shrink-0 w-[50px] h-[50px]">
              <BetterImage
                src={
                  cnl?.id === user.id
                    ? admin.imageUrl
                    : (cnl.data?.image as string)
                }
                width={250}
                height={250}
                alt={cnl.data?.name || "channel_logo"}
                className="w-full h-full aspect-square rounded-full"
              />
            </div>
            <div className="hidden md:flex flex-col flex-grow overflow-hidden">
              <h2 className="w-full text-left truncate capitalize text-foreground text-[15px]">
                {cnl.data?.name}
              </h2>
              <span className="text-muted-foreground flex gap-2 w-full truncate">
                {lastMessage}
              </span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" side="right">
          <p>{cnl.data?.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Sidebar className="backdrop-blur">
        <SidebarContent className="bg-muted/50 md:px-1.5">
          <SidebarGroup className="h-full">
            <SidebarGroupLabel className="px-1 text-2xl text-foreground font-bold sr-only md:not-sr-only">
              Chat
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1.5 h-full flex flex-col justify-between">
              <SidebarMenu className="h-full">
                <SidebarMenuItem className="flex flex-col items-center gap-2 w-full">
                  {channels.length > 0 && channels.map(renderChannelButton)}
                </SidebarMenuItem>
                {/* <SidebarMenuItem className="flex flex-col items-center gap-2 w-full">
                {user.id !== admin.id &&
                  channels.length > 0 &&
                  channels.map(renderAdminChannelButton)}
              </SidebarMenuItem> */}
              </SidebarMenu>
              <SidebarMenu className="hidden md:flex">
                <Button
                  variant="outline"
                  className="flex flex-col bg-rose-800/70 border-rose-700 hover:bg-rose-800 dark:text-white text-rose-950 hover:text-white gap-1 h-auto"
                  asChild
                >
                  <Link href="/chat/nova">
                    <span>Who Am I?</span>
                    <span>
                      Ask <span className="font-bold underline">Nova</span> to
                      Find Out!
                    </span>
                  </Link>
                </Button>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default ChatSideBar;
