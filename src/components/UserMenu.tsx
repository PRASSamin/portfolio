"use client";
import Image from "next/image";
import { cn } from "@/utils";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { BetterImage } from "@prass/betterimage/components";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Gear = () => {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className="w-5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.559 2.536A.667.667 0 0 1 7.212 2h1.574a.667.667 0 0 1 .653.536l.22 1.101c.466.178.9.429 1.287.744l1.065-.36a.667.667 0 0 1 .79.298l.787 1.362a.666.666 0 0 1-.136.834l-.845.742c.079.492.079.994 0 1.486l.845.742a.666.666 0 0 1 .137.833l-.787 1.363a.667.667 0 0 1-.791.298l-1.065-.36c-.386.315-.82.566-1.286.744l-.22 1.101a.666.666 0 0 1-.654.536H7.212a.666.666 0 0 1-.653-.536l-.22-1.101a4.664 4.664 0 0 1-1.287-.744l-1.065.36a.666.666 0 0 1-.79-.298L2.41 10.32a.667.667 0 0 1 .136-.834l.845-.743a4.7 4.7 0 0 1 0-1.485l-.845-.742a.667.667 0 0 1-.137-.833l.787-1.363a.667.667 0 0 1 .791-.298l1.065.36c.387-.315.821-.566 1.287-.744l.22-1.101ZM7.999 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      ></path>
    </svg>
  );
};

const Logout = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn("w-5", className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6 2.604A2.045 2.045 0 0 1 4.052 2h3.417c.544 0 1.066.217 1.45.604.385.387.601.911.601 1.458v.69c0 .413-.334.75-.746.75a.748.748 0 0 1-.745-.75v-.69a.564.564 0 0 0-.56-.562H4.051a.558.558 0 0 0-.56.563v7.875a.564.564 0 0 0 .56.562h3.417a.558.558 0 0 0 .56-.563v-.671c0-.415.333-.75.745-.75s.746.335.746.75v.671c0 .548-.216 1.072-.6 1.459a2.045 2.045 0 0 1-1.45.604H4.05a2.045 2.045 0 0 1-1.45-.604A2.068 2.068 0 0 1 2 11.937V4.064c0-.548.216-1.072.6-1.459Zm8.386 3.116a.743.743 0 0 1 1.055 0l1.74 1.75a.753.753 0 0 1 0 1.06l-1.74 1.75a.743.743 0 0 1-1.055 0 .753.753 0 0 1 0-1.06l.467-.47H5.858A.748.748 0 0 1 5.112 8c0-.414.334-.75.746-.75h5.595l-.467-.47a.753.753 0 0 1 0-1.06Z"
      ></path>
    </svg>
  );
};

export const UserMenuButton = ({
  variant = "default",
}: {
  variant?: "muted" | "default";
}) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="hidden md:flex items-center justify-center h-full relative ">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="relative h-10 w-10 group overflow-hidden ring ring-ring/10 rounded-full hover:ring-muted-foreground/30 transition-all duration-300 cursor-pointer">
            <div className="absolute -top-14 group-hover:top-full group-hover:left-full transition-all duration-700 left-0 bg-muted-foreground/50 w-1.5 h-[200%] z-10 rotate-45"></div>
            <BetterImage
              src={user.avatar ?? ""}
              alt={`${user.full_name} avatar`}
              width={100}
              height={100}
              className="rounded-full transition-all duration-300"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mt-5 mr-2 rounded-xl flex flex-col gap-3 border border-muted-foreground/20 bg-transparent p-0">
          <div className={cn("w-full")}>
            <div
              data-section="user-profile"
              className={cn(
                "flex items-center justify-start min-w-0 gap-4 w-full py-4 px-5 border-b border-muted-foreground/20 backdrop-blur rounded-t-xl",
                variant === "default" ? "bg-popover/60" : "bg-muted/60"
              )}
            >
              <span className="flex items-stretch justify-start flex-shrink-0 rounded-full overflow-hidden w-[2.25rem] h-[2.25rem] relative">
                {user?.avatar && (
                  <Image
                    className="object-cover w-full h-full"
                    title={`${user?.full_name}`}
                    src={user?.avatar}
                    alt={`${user?.full_name}'s logo`}
                    width={50}
                    height={50}
                  />
                )}
              </span>
              <span className="flex flex-col items-stretch justify-center text-left">
                <span className="text-[0.8rem] font-medium flex gap-1 items-center truncate">
                  {user?.full_name}
                </span>
                <span className="truncate text-[0.8rem] font-normal text-muted-foreground">
                  {user?.username || user?.email}
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/me");
              }}
              data-section="manage-account"
              className={cn(
                "flex items-center font-medium text-[0.8125rem] justify-start min-w-0 gap-4 w-full py-[0.7rem] px-5 border-b border-muted-foreground/20 backdrop-blur hover:bg-[#1f1f23] text-muted-foreground focus-visible:outline-none",
                variant === "default" ? "bg-popover/60" : "bg-muted/60"
              )}
            >
              <span className="flex items-stretch justify-center flex-shrink-0 overflow-hidden w-[2.25rem] h-[2.25rem] relative">
                <Gear />
              </span>
              <span className="flex flex-col items-stretch justify-center text-left">
                Manage account
              </span>
            </button>
            <button
              onClick={async () => {
                signOut({
                  callbackUrl: "/",
                  loading: setIsLogoutLoading,
                });
              }}
              data-section="sign-out"
              className={cn(
                "flex items-center font-medium text-[0.8125rem] justify-start min-w-0 gap-4 w-full py-[0.7rem] px-5 border-b border-muted-foreground/20  backdrop-blur hover:bg-[#1f1f23] text-muted-foreground z-10 relative rounded-b-lg focus-visible:outline-none",
                variant === "default" ? "bg-popover/60" : "bg-muted/60"
              )}
            >
              <span className="flex items-center justify-center flex-shrink-0 overflow-hidden w-[2.25rem] h-[2.25rem] relative">
                {isLogoutLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Logout />
                )}
              </span>
              <span className="flex flex-col items-stretch justify-center text-left">
                Sign out
              </span>
            </button>
            <div className="w-full flex items-center justify-center text-white/50 h-4 -mt-1 bg-muted-foreground/40 gap-2 relative rounded-b-lg"></div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const UserMenu: React.FC<Partial<Pick<HTMLDivElement, "className">>> = ({
  className,
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    isLoaded && (
      <div className={cn("w-full", className)}>
        <div
          data-section="user-profile"
          className="flex items-center justify-start min-w-0 gap-4 w-full py-4 px-5 border-b border-muted-foreground/20 bg-muted rounded-t-lg"
        >
          <span className="flex items-stretch justify-start flex-shrink-0 rounded-full overflow-hidden w-[2.25rem] h-[2.25rem] relative">
            {user?.avatar && (
              <Image
                className="object-cover w-full h-full"
                title={`${user?.full_name}`}
                src={user?.avatar}
                alt={`${user?.full_name}'s logo`}
                width={50}
                height={50}
              />
            )}
          </span>
          <span className="flex flex-col items-stretch justify-center text-left">
            <span className="text-[0.8rem] font-medium flex gap-1 items-center truncate">
              {user?.full_name}
            </span>
            <span className="truncate text-[0.8rem] font-normal text-muted-foreground">
              {user?.username || user?.primaryEmailAddress?.emailAddress}
            </span>
          </span>
        </div>
        <button
          onClick={() => {
            document.getElementById("navToggler")?.click();
            router.push("/me");
          }}
          data-section="manage-account"
          className="flex items-center font-medium text-[0.8125rem] justify-start min-w-0 gap-4 w-full py-[0.7rem] px-5 border-b border-muted-foreground/20 bg-muted hover:bg-[#1f1f23] text-muted-foreground"
        >
          <span className="flex items-stretch justify-center flex-shrink-0 overflow-hidden w-[2.25rem] h-[2.25rem] relative">
            <Gear />
          </span>
          <span className="flex flex-col items-stretch justify-center text-left">
            Manage account
          </span>
        </button>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/", loading: setIsLogoutLoading });
          }}
          data-section="sign-out"
          className="flex items-center font-medium text-[0.8125rem] justify-start min-w-0 gap-4 w-full py-[0.7rem] px-5 border-b border-muted-foreground/20 bg-muted hover:bg-[#1f1f23] text-muted-foreground z-10 relative rounded-b-lg"
        >
          <span className="flex items-center justify-center flex-shrink-0 overflow-hidden w-[2.25rem] h-[2.25rem] relative">
            {isLogoutLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Logout />
            )}
          </span>
          <span className="flex flex-col items-stretch justify-center text-left">
            Sign out
          </span>
        </button>
        <div className="w-full flex items-center justify-center text-white/50 h-4 -mt-1 bg-muted-foreground/40 gap-2 relative rounded-b-lg"></div>
      </div>
    )
  );
};
