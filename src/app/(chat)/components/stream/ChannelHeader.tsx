import React from "react";

import { ChannelAvatarProps, Avatar as DefaultAvatar } from "stream-chat-react";
import { useChannelPreviewInfo } from "stream-chat-react";

import { useChannelStateContext } from "stream-chat-react";
import { useTranslationContext } from "stream-chat-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { StreamChannel } from "@/types";

import type { DefaultStreamChatGenerics } from "stream-chat-react";

export type ChannelHeaderProps = {
  /** UI component to display an avatar, defaults to [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx) component and accepts the same props as: [ChannelAvatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/ChannelAvatar.tsx) */
  Avatar?: React.ComponentType<ChannelAvatarProps>;
  /** Manually set the image to render, defaults to the Channel image */
  image?: string;
  /** Show a little indicator that the Channel is live right now */
  live?: boolean;
  /** Set title manually */
  title?: string;
};

type ExtendedStreamChatGenerics = DefaultStreamChatGenerics & {
  channelType: StreamChannel
}

/**
 * The ChannelHeader component renders some basic information about a Channel.
 */
export const ChannelHeader = <
  StreamChatGenerics extends ExtendedStreamChatGenerics = ExtendedStreamChatGenerics
>(
  props: ChannelHeaderProps
) => {
  const {
    Avatar = DefaultAvatar,
    image: overrideImage,
    live,
    title: overrideTitle,
  } = props;

  const { channel, watcher_count } =
    useChannelStateContext<StreamChatGenerics>("ChannelHeader");
  const { t } = useTranslationContext("ChannelHeader");
  const { displayImage, displayTitle, groupChannelDisplayInfo } =
    useChannelPreviewInfo({
      channel,
      overrideImage,
      overrideTitle,
    });

  const { member_count, subtitle } = channel?.data || {};

  const [isInvite, setIsInvite] = useState<boolean>(false);
  const [inviteUrl] = useState<string>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chat/invite/${channel?.data?.metadata?.inviteToken}`
  );

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsInvite(false);
  };

  return (
    <div className="str-chat__channel-header">
      <Avatar
        className="str-chat__avatar--channel-header"
        groupChannelDisplayInfo={groupChannelDisplayInfo}
        image={displayImage}
        name={displayTitle}
      />
      <div className="str-chat__channel-header-end">
        <p className="str-chat__channel-header-title">
          {displayTitle}{" "}
          {live && (
            <span className="str-chat__header-livestream-livelabel">
              {t<string>("live")}
            </span>
          )}
        </p>
        {subtitle && (
          <p className="str-chat__channel-header-subtitle">{subtitle}</p>
        )}
        <p className="str-chat__channel-header-info">
          {!live && !!member_count && member_count > 0 && (
            <>
              {t("{{ memberCount }} members", {
                memberCount: member_count,
              })}
              ,{" "}
            </>
          )}
          {t<string>("{{ watcherCount }} online", {
            watcherCount: watcher_count,
          })}
        </p>
      </div>
      <ul className={`text-white mr-4`}>
        <li>
          <button
            onClick={() => setIsInvite(!isInvite)}
            className={`dark:bg-muted bg-gray-300 rounded px-2 py-1 hover:bg-gray-300/50 dark:hover:bg-muted/50 text-foreground`}
          >
            Invite
          </button>
          {isInvite && (
            <div
              data-label={"invite_model"}
              onClick={() => setIsInvite(false)}
              className={`fixed inset-0 z-50 w-screen h-screen bg-black/50 backdrop-blur-[2px] flex justify-center items-center`}
            >
              <CircleX
                className={`text-muted-foreground cursor-pointer absolute top-5 right-5`}
                onClick={() => setIsInvite(false)}
              />

              <div
                onClick={(e) => e.stopPropagation()}
                className={`flex flex-col justify-center items-center bg-sidebar w-[calc(100vw-20px)] md:w-[500px] max-w-[500px] rounded-lg shadow-lg`}
              >
                <div
                  data-label={`model_header`}
                  className={`dark:bg-background bg-gray-300 text-foreground rounded-t-lg py-2 w-full`}
                >
                  <p className={`w-full text-center capitalize font-bold`}>
                    Invite to this channel
                  </p>
                </div>
                <div
                  data-label={`model_content`}
                  className={`w-full flex flex-col justify-start items-center px-2 pt-10 pb-5 gap-2`}
                >
                  <input
                    readOnly={true}
                    type="text"
                    defaultValue={inviteUrl}
                    className={`w-full p-2 border border-border rounded-b-lg`}
                  />

                  <Button
                    variant={`secondary`}
                    onClick={() => handleCopy(inviteUrl)}
                    className={`mt-2 font-bold bg-shaded text-white hover:bg-shaded/50 transition-all duration-150`}
                  >
                    Copy To Clipboard
                  </Button>
                </div>
              </div>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};
