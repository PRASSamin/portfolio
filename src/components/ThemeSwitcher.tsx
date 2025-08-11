"use client";

import * as React from "react";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, themes } from "@/context/ThemeProvider";
import { cn } from "@/utils";
import { Keybindy } from "@keybindy/react";
import { isTypingInFormElement } from "@/context/GlobalKeyBinderProvider";

export function ThemeSwitcher() {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <Keybindy
      shortcuts={[
        {
          keys: ["Arrow Right"],
          handler: () => {
            if (isTypingInFormElement()) return;
            const index = Object.keys(themes).indexOf(activeTheme);
            const nextIndex = (index + 1) % Object.keys(themes).length;
            setTheme(Object.keys(themes)[nextIndex] as any);
          },
          options: {
            preventDefault: true,
            data: {
              group: "On this page",
              description: "Next theme",
            },
          },
        },
        {
          keys: ["Arrow Left"],
          handler: () => {
            if (isTypingInFormElement()) return;
            const index = Object.keys(themes).indexOf(activeTheme);
            const prevIndex =
              (index - 1 + Object.keys(themes).length) %
              Object.keys(themes).length;
            setTheme(Object.keys(themes)[prevIndex] as any);
          },
          options: {
            preventDefault: true,
            data: {
              group: "On this page",
              description: "Previous theme",
            },
          },
        },
      ]}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 cursor-pointer focus-visible:outline-none focus-visible:ring-0"
          >
            <Palette className="!size-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="p-4 border-border/50 rounded-lg bg-popover/50 backdrop-blur-lg"
        >
          <DropdownMenuLabel className="text-lg p-0">
            Select Theme
          </DropdownMenuLabel>
          <div className="text-xs text-muted-foreground mb-5">
            Select your preferred theme
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(themes).map((theme, index) => (
              <button
                key={theme}
                onClick={() => setTheme(theme as any)}
                suppressHydrationWarning
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-0 border",
                  activeTheme === theme ? "bg-accent" : ""
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full",
                      themes[theme as keyof typeof themes]
                    )}
                  />
                  <span className="capitalize">{theme}</span>
                </div>
                <DropdownMenuShortcut className="text-[10px]">{`F${
                  index + 1
                }`}</DropdownMenuShortcut>
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </Keybindy>
  );
}
