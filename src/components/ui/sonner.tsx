"use client";
import { cn } from "@/utils";
import { Toaster as Sonner } from "sonner";
import { useSonner } from "@/hooks/useSonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme, className, ...props }: ToasterProps) => {
  const {
    options: { className: scn, theme: sTheme, toastOptions, ...rest },
  } = useSonner();

  return (
    <Sonner
      theme={sTheme || theme || "dark"}
      className={cn("toaster group", className, scn)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-opacity-20 group-[.toaster]:backdrop-blur-md group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-2 group-[.toaster]:border",
          description: "group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-opacity-30 group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-opacity-30 group-[.toast]:text-muted-foreground group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:rounded-md",

          error:
            "group-[.toaster]:bg-red-900/20 group-[.toaster]:text-red-500 group-[.toaster]:border-red-500/40",
          success:
            "group-[.toaster]:bg-green-900/20 group-[.toaster]:text-green-500 group-[.toaster]:border-green-500/40",
          warning:
            "group-[.toaster]:bg-yellow-900/20 group-[.toaster]:text-yellow-500 group-[.toaster]:border-yellow-500/40",
          info: "group-[.toaster]:bg-blue-900/20 group-[.toaster]:text-blue-500 group-[.toaster]:border-blue-500/40",
        },
        ...toastOptions,
      }}
      {...rest}
      {...props}
    />
  );
};

export { Toaster };
