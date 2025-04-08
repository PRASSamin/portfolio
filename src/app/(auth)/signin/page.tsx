"use client";
import { useUser } from "@/hooks/useUser";
import { BetterImage } from "@prass/betterimage/components";
import OAuthButton from "@/components/OAuthButton";
import { Info, Loader } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

export default function Page() {
  const { isLoaded } = useUser();

  return (
    <div className="bg-card/80 w-full max-w-[95%] lg:max-w-4xl h-[80vh] rounded-2xl shadow-lg grid md:grid-cols-2 grid-rows-2 md:grid-rows-none overflow-hidden relative">
      {!isLoaded ? (
        <div className="flex items-center justify-center col-span-2 row-span-2">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          {/* Left Section (Anime Collage) */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-card/50 z-10" />
            <BetterImage
              src="/anime_collage.png"
              width={1000}
              height={1000}
              className="w-full h-full object-cover object-center"
              style={{
                maskImage:
                  "radial-gradient(circle, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 100%)",
              }}
              alt="Anime"
            />

            <HoverCard closeDelay={0} openDelay={0}>
              <HoverCardTrigger asChild>
                <Info className="text-foreground/70 absolute top-4 left-4 z-10 cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                className="mt-24 px-3 py-2 text-sm text-foreground/80 bg-card/90 border-border/50"
              >
                This background image is a custom collage featuring my favorite
                anime characters. Since this website is a reflection of my
                personality, I wanted to incorporate elements that resonate with
                me, creating a unique and personal touch.
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Right Section (Login Content) */}
          <div className="flex flex-col items-center justify-center px-10 space-y-2 w-full">
            <h2 className="text-3xl font-bold text-center">
              Welcome to{" "}
              <Link href={"/"}>
                <span className="font-frozito text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-violet-500">
                  PRAS
                </span>
              </Link>
            </h2>
            <p className="text-gray-600 text-center">
              Please authenticate to continue.
            </p>
            <div className="flex flex-col gap-2 w-full items-center justify-center pt-10">
              <OAuthButton provider="google" />
              <OAuthButton provider="github" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
