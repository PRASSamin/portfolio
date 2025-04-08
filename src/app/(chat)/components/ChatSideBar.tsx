"use client";
import type { Channel as StreamChannel } from "stream-chat";
import { MyUser } from "@/types";
import { cn } from "@/utils";
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
import { useChat } from "@/context/ChatProvider";
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
              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-[#2C2C30]",
              cnl.id === activeChannel?.id && "bg-[#2C2C30]"
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
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default ChatSideBar;
