"use client";
import { Github, Google } from "@/components/icons";
import { User } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils";
import { useState } from "react";

const ConnectedAccountInfo = ({ user }: { user: User }) => {
  const { signIn } = useAuth();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (provider: string) => {
    if (isConnecting) return;
    try {
      setIsConnecting(provider);
      await signIn(provider);
    } catch (error) {
      console.error("OAuth Sign-In failed:", error);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div data-id="connect-account-info" className="mt-4 mb-6">
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
        Connected Accounts
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key="profile-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col mt-4"
        >
          {/* Connected accounts list */}
          {user.connected_accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between px-3 py-2 rounded-md"
            >
              <div className="flex items-center gap-3">
                {account.provider === "google" ? (
                  <Google size={20} />
                ) : (
                  <Github size={20} />
                )}
                <div className="text-sm font-medium capitalize">
                  {account.provider}
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {
                    // @ts-expect-error: name not exist error but it exists just a type error
                    account?.provider_data?.name
                  }
                </div>
              </div>
            </div>
          ))}

          {/* Connect new account button */}
          {user.connected_accounts.length < 2 && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition">
                  <Plus size={16} />
                  Connect another account
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Connect Account</DialogTitle>
                  <DialogDescription>
                    Link an external account to your profile.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8 flex flex-col gap-2 sm:space-x-0">
                  {["google", "github"].map((provider) =>
                    user.connected_accounts.find(
                      (account) => account.provider === provider
                    ) ? null : (
                      <button
                        key={provider}
                        onClick={() => handleConnect(provider)}
                        disabled={isConnecting ? true : false}
                        className={cn(
                          "flex items-center justify-center gap-3 w-full px-4 py-2 rounded-md border bg-muted hover:bg-muted/70 transition-all font-medium  focus:ring-2 focus:ring-muted-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {isConnecting === provider ? (
                          <Loader2 className="animate-spin size-5" />
                        ) : provider === "google" ? (
                          <Google className="size-5" />
                        ) : (
                          <Github className="size-5" />
                        )}
                        <span className="capitalize">{provider}</span>
                      </button>
                    )
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ConnectedAccountInfo;
