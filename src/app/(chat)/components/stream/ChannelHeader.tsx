import React from "react";

import { ChannelAvatarProps, Avatar as DefaultAvatar } from "stream-chat-react";
import { useChannelPreviewInfo } from "stream-chat-react";

import { useChannelStateContext } from "stream-chat-react";
import { useTranslationContext } from "stream-chat-react";
import { useState } from "react";
import { StreamChannel } from "@/types";

import type { DefaultStreamChatGenerics } from "stream-chat-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  channelType: StreamChannel;
};

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
      <ul className="mr-4 text-white">
        <li>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-chat-deep text-foreground hover:bg-muted transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Invite
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border/50">
              <DialogHeader>
                <h2 className="text-center font-semibold text-lg mb-10">
                  Invite to this channel
                </h2>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <input
                  readOnly
                  type="text"
                  value={inviteUrl}
                  className="w-full px-3 py-2 border border-border/50 rounded-md bg-transparent text-sm text-foreground focus:outline-none"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(inviteUrl)}
                    className="font-semibold bg-purple-900 text-white hover:bg-purple-900/80 transition w-full"
                  >
                    Copy Invite Link
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </li>
      </ul>
    </div>
  );
};
