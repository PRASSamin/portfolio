"use client";
import React, { useEffect, useState } from "react";
import {
  Keybindy,
  ShortcutLabel,
  KeybindyShortcut,
  useKeybindy,
} from "@keybindy/react";
import axios from "axios";
import { toast } from "sonner";
import { HelpCircle, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useRouter as useRouterWithProgress } from "@/hooks/useRouter";
import { usePathname } from "next/navigation";
import { themes, useTheme } from "./ThemeProvider";

export const isTypingInFormElement = () => {
  if (typeof document === "undefined") return false;
  const activeElement = document.activeElement;
  const tagName = activeElement?.tagName?.toLowerCase();
  const isInput =
    tagName === "input" || tagName === "textarea" || tagName === "select";
  const isContentEditable =
    activeElement?.getAttribute("contenteditable") === "true";
  return isInput || isContentEditable;
};

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
  const binder = useKeybindy();
  const { setTheme } = useTheme();

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
        if (isTypingInFormElement()) return;
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
      keys: [["Ctrl", "Shift", "A"]],
      handler: () => {
        routerWithProgress.push("/admin");
      },
      options: {
        preventDefault: true,
        data: {
          description: "Navigate to admin panel",
          hidden: mounted && !pathname.startsWith("/admin") ? true : false,
        },
      },
    },
  ];

  Array.from(Object.keys(themes)).forEach((theme, index) => {
    shortcuts.push({
      keys: [`F${index + 1}` as any],
      handler: () => {
        setTheme(theme as any);
      },
      options: {
        preventDefault: true,
        data: {
          description: `Set theme to ${theme}`,
          hidden: true,
        },
      },
    });
  });

  const formatKey = (key: string) => {
    const isMac =
      typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);
    switch (key.toLowerCase()) {
      case "meta":
        return isMac ? "⌘" : "Win";
      case "ctrl":
        return "Ctrl";
      case "shift":
        return "⇧";
      case "alt":
        return isMac ? "⌥" : "Alt";
      case "enter":
        return "↵";
      case "arrow right":
        return "↬";
      case "arrow left":
        return "↫";
      default:
        return key.toUpperCase();
    }
  };

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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[51]"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-all"
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
              <div className="p-4 pb-0 overflow-auto max-h-[calc(100vh-200px)] scrollbar-auto">
                {/* Shortcut List */}
                {binder &&
                  (() => {
                    const grouped = binder
                      .getCheatSheet()
                      ?.reduce(
                        (acc: { [key: string]: any[] }, shortcut: any) => {
                          if (shortcut?.hidden) return acc;
                          const group = shortcut.group || "General";
                          if (!acc[group]) {
                            acc[group] = [];
                          }
                          acc[group].push(shortcut);
                          return acc;
                        },
                        {}
                      );

                    if (!grouped) return null;

                    // Sort groups: custom groups first
                    const sortedGroups = Object.entries(grouped).sort(
                      ([groupA], [groupB]) => {
                        if (groupA === "General") return 1;
                        if (groupB === "General") return -1;
                        return groupA.localeCompare(groupB);
                      }
                    );

                    return sortedGroups.map(([group, shortcuts], i) => (
                      <div key={group} className={i > 0 ? "mt-4" : ""}>
                        <p className="text-sm font-medium text-foreground mb-2">
                          {group}
                        </p>
                        <ul className="space-y-2">
                          {shortcuts.map((shortcut: any, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <p
                                className="text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                  __html: shortcut?.description,
                                }}
                              />
                              <ShortcutLabel
                                className="!bg-transparent !border-0 flex gap-2"
                                keys={shortcut.keys}
                                render={(keys) => {
                                  return keys.map((key) => (
                                    <span
                                      key={Math.random()}
                                      className="text-xs font-medium text-foreground rounded px-2 py-1 bg-muted border-muted uppercase"
                                    >
                                      {formatKey(key as any)}
                                    </span>
                                  ));
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}
              </div>
              {/* Promo Area */}
              <div className="py-3 mt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-center">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Keybindy>
  );
};

export default GlobalKeyBinderProvider;
