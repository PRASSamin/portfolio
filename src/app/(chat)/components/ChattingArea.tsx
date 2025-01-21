import Link from "next/link";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { ChannelHeader } from "../components/stream/ChannelHeader";
import { EmojiPicker } from "stream-chat-react/emojis";
import { useChat } from "@/app/context/ChatProvider";
import { MyUser } from "@/types";
import { type StreamChat } from "stream-chat";

type Props = {
  client: StreamChat;
  user: MyUser;
  admin: MyUser;
};

const ChattingArea = ({ client, user, admin }: Props) => {
  const { activeChannel } = useChat();

  return (
    <div className="bg-muted/50 w-full h-[calc(100vh-64px)]">
      <Link href={"/chat/nova"}>
        <div className="cursor-pointer bg-rose-500/80 dark:bg-rose-950 border-b border-rose-800 w-full flex md:hidden items-center justify-center text-sm py-1.5">
          <p>
            Who Am I? Ask <span className="font-bold underline">Nova</span> to
            Find Out!
          </p>
        </div>
      </Link>
      <div className="w-full h-[calc(100%-33px)] md:h-full">
        <Chat client={client} theme="str-chat__theme-custom">
          {activeChannel ? (
            <Channel channel={activeChannel} EmojiPicker={EmojiPicker}>
              <Window>
                <ChannelHeader
                  image={
                    activeChannel.id === user.id ? admin.imageUrl : undefined
                  }
                />
                <MessageList
                  messageActions={["delete", "react", "reply", "edit", "quote"]}
                />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No active channel. Please wait or try again.</p>
            </div>
          )}
        </Chat>
      </div>
    </div>
  );
};

export default ChattingArea;
