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
import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { Loader } from "lucide-react";

type Props = {
  client: StreamChat;
  user: MyUser;
  admin: MyUser;
};

init({
  data,
});

const EmojiPickerWithTheme = () => {
  const { theme } = useTheme();

  return (
    <EmojiPicker pickerProps={{ theme: theme === "dark" ? "dark" : "light" }} />
  );
};

const ChattingArea = ({ client, user, admin }: Props) => {
  const { activeChannel } = useChat();

  return (
    <div className="bg-muted/50 z-50 shadow-[-7px_-2px_10px_-2px_#0000001a] w-full h-[calc(100vh-64px)]">
      <Link href={"/chat/nova"}>
        <div className="cursor-pointer bg-rose-500/80 dark:bg-rose-950 border-b border-rose-800 w-full flex md:hidden items-center justify-center text-sm py-1.5">
          <p>
            Who Am I? Ask <span className="font-bold underline">Nova</span> to
            Find Out!
          </p>
        </div>
      </Link>
      <div className="w-full h-[calc(100%-33px)] bg-chat md:h-full relative">
        <Chat client={client}>
          {activeChannel ? (
            <Channel
              channel={activeChannel}
              emojiSearchIndex={SearchIndex}
              EmojiPicker={EmojiPickerWithTheme}
            >
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
              {user.id === admin.id ? (
                "No Channels Found"
              ) : (
                <Loader className="animate-spin" />
              )}
            </div>
          )}
        </Chat>
      </div>
    </div>
  );
};

export default ChattingArea;
