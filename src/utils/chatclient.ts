import { StreamChat } from "stream-chat";

export const client = StreamChat.getInstance(
  process.env.NEXT_STREAM_API_KEY!,
  process.env.NEXT_STREAM_API_SECRET!
);
