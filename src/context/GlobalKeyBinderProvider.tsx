"use client";
import React, { useEffect, useState } from "react";
import { Keybindy, ShortcutLabel, KeybindyShortcut } from "@keybindy/react";
import axios from "axios";
import { toast } from "sonner";
import { HelpCircle, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useRouter as useRouterWithProgress } from "@/hooks/useRouter";
import { usePathname } from "next/navigation";

const GlobalKeyBinderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSignOutProcessing, setIsSignOutProcessing] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const router = useRouter();
  const routerWithProgress = useRouterWithProgress();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shortcuts: KeybindyShortcut[] = [
    {
      keys: ["Ctrl", "Shift", "Q"],
      handler: async () => {
        setIsSignOutProcessing(true);
        try {
          await axios.post("/api/auth/signout", {
            redirect: "/",
          });
          router.push("/");
        } catch (e) {
          toast.error("Failed to sign out");
        } finally {
          setIsSignOutProcessing(false);
        }
      },
      options: {
        data: {
          description: "Sign out",
        },
      },
    },
    {
      keys: ["Ctrl", "Shift", "S"],
      handler: async () => {
        routerWithProgress.push("/signin");
      },
      options: {
        data: {
          description: "Navigate to sign in page",
        },
      },
    },
    {
      keys: ["G"],
      handler: async () => {
        routerWithProgress.push("https://github.com/prassamin");
      },
      options: {
        data: {
          description: "Open PRAS GitHub",
        },
      },
    },
    {
      keys: ["Ctrl", "Shift"],
      handler: (e, state) => {
        if (state === "down") {
          setIsHelpOpen(true);
        } else {
          setIsHelpOpen(false);
        }
      },
      options: {
        hold: true,
        data: {
          description: "Toggle help",
        },
      },
    },
    {
      keys: ["Ctrl", "Shift", "A"],
      handler: () => {
        routerWithProgress.push("/admin");
      },
      options: {
        preventDefault: true,
        data: {
          description: "Navigate to admin panel",
          hidden: mounted && !pathname.startsWith("/admin") ? "true" : "false",
        },
      },
    },
  ];

  return (
    <Keybindy shortcuts={shortcuts}>
      {children}
      <AnimatePresence>
        {isSignOutProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2.5 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg rounded-xl flex items-center gap-2.5 transition-all duration-300 hover:shadow-xl hover:bg-background/100 group">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm font-medium text-foreground/90">
                Signing out...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setIsHelpOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-background rounded-xl border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Shortcut List */}
                <ul className="space-y-2">
                  {shortcuts.map((shortcut, index) => {
                    if (shortcut.options?.data?.hidden === "true") return;
                    return (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {shortcut.options?.data?.description}
                        </span>
                        <ShortcutLabel keys={shortcut.keys as any} />
                      </li>
                    );
                  })}
                </ul>

                {/* 💥 Promo Area */}
                <div className="pt-4 mt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-center">
                  <span>
                    Powered by{" "}
                    <a
                      href="https://github.com/keybindyjs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:underline"
                    >
                      @keybindy
                    </a>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Keybindy>
  );
};

export default GlobalKeyBinderProvider;
