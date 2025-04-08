"use client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import { SVGProps, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@/hooks/useUser";
import { Google, Github } from "./icons";

interface OAuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "github";
  label?: string;
  loader?: React.ReactNode;
  onClick?: () => void;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  label,
  loader,
  className,
  onClick,
  ...props
}) => {
  const { signIn, signOut } = useAuth();
  const { isSignedIn, user } = useUser();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!provider) {
    throw new Error("OAuthButton requires a provider.");
  }

  const handleSignIn = async () => {
    if (isAuthenticating) return;
    try {
      setIsAuthenticating(true);
      onClick?.();
      await signIn(provider);
    } catch (error) {
      console.error("OAuth Sign-In failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center w-full gap-3 rounded-xl border border-muted-foreground/20 px-4 py-2 text-sm font-medium shadow-md transition-all active:shadow-sm focus:ring-2 bg-muted text-foreground hover:bg-muted/70 focus:ring-muted-foreground/30 focus:bg-muted/70 [&_svg]:size-6 font-sans disabled:opacity-80 disabled:cursor-not-allowed",
            className
          )}
          onClick={handleSignIn}
          disabled={isAuthenticating || isSignedIn}
          {...props}
        >
          <div className="flex items-center justify-center gap-2">
            {isAuthenticating ? (
              loader || <Loader2 className="animate-spin" />
            ) : (
              <Icon provider={provider} />
            )}
            <span className="w-full capitalize">{label || provider}</span>
          </div>
        </button>
      </HoverCardTrigger>

      {isSignedIn && (
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="font-semibold text-foreground">{user?.full_name}</span>
              </p>
              <div className="flex items-center pt-2">
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="text-xs text-muted-foreground underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default OAuthButton;

const Icon: React.FC<
  SVGProps<SVGSVGElement> & { provider: "google" | "github" }
> = ({ provider, ...props }) => {
  switch (provider) {
    case "google":
      return <Google {...props} />;
    case "github":
      return <Github {...props} />;
    default:
      return null;
  }
};