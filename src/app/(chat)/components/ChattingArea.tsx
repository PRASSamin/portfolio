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
import { useChat } from "@/context/ChatProvider";
import { User } from "@/types";
import { type StreamChat } from "stream-chat";
import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";
import { Loader } from "lucide-react";

type Props = {
  client: StreamChat;
  user: User;
  admin: User;
};

init({
  data,
});

const EmojiPickerWithTheme = () => {
  return <EmojiPicker pickerProps={{ theme: "dark" }} />;
};

const ChattingArea = ({ client, user, admin }: Props) => {
  const { activeChannel } = useChat();

  return (
    <div className="bg-muted/50 z-50 shadow-[-7px_-2px_10px_-2px_#0000001a] w-full h-[calc(100vh-64px)]">
      <div className="w-full h-full bg-chat md:h-full relative">
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
