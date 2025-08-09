import { Button } from "@/components/ui/button";
import { CloudinaryFile, CloudinaryFolder } from "@/types";
import { cn } from "@/utils";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import { formatBytes } from "@/utils/format-bytes";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useState } from "react";
import { Keybindy } from "@keybindy/react";
import { useMediaView } from "../hooks/useMediaView";
import { toast } from "sonner";

interface SelectionDetailsProps {
  selection: CloudinaryFile | CloudinaryFolder | null;
  onClose: () => void;
  onDelete: (item: CloudinaryFile | CloudinaryFolder) => void;
}

export const SelectionDetails = ({
  selection,
  onClose,
  onDelete,
}: SelectionDetailsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const isFolder = selection && "__meta" in selection;

  const handleCopy = () => {
    if (!selection || isFolder) return;
    copyToClipboard((selection as CloudinaryFile).secure_url, () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Keybindy
      shortcuts={[
        {
          keys: ["Ctrl", "C"],
          handler: async () => {
            if (!selection) return;
            copyToClipboard((selection as CloudinaryFile).secure_url);
            setIsCopied(true);
            toast.success("Copied to clipboard.");
            setTimeout(() => setIsCopied(false), 1000);
          },
          options: {
            data: {
              description: `Copy <b style="font-weight: bold; background-color: transparent; color: hsl(var(--foreground))">${selection?.secure_url
                ?.split("/")
                .pop()}</b>`,
              group: "On this page",
            },
          },
        },
        {
          keys: ["Esc"],
          handler: async () => {
            onClose();
          },
          options: {
            data: {
              description: `Close Properties`,
              group: "On this page",
            },
          },
        },
      ]}
    >
      <div
        className={cn(
          "bg-background/85 rounded-t-lg lg:rounded-r-lg border-t lg:border-l lg:border-t-0 flex lg:flex-col items-start lg:items-center gap-3 transition-all duration-300 relative",
          selection
            ? "w-full h-[40%] lg:h-full lg:w-[40%] p-4 "
            : "w-0 h-0 p-0 border-0 opacity-0"
        )}
      >
        {selection && (
          <>
            <Button
              variant={"secondary"}
              onClick={onClose}
              size={"icon"}
              className="absolute -top-8 lg:top-2 right-2 lg:-left-8 rounded-full w-6 h-6 bg-red-900/70 hover:bg-red-900/50"
            >
              <X className="!size-3.5 text-red-500" />
            </Button>
            {!isFolder && (
              <div className="w-full aspect-[16/11] flex justify-start">
                <div className="w-full aspect-[16/11] bg-muted rounded-lg p-1">
                  {selection.resource_type !== "video" &&
                    selection.resource_type !== "raw" && (
                      <Image
                        src={(selection as CloudinaryFile).secure_url}
                        alt={(selection as CloudinaryFile).display_name}
                        width={500}
                        height={500}
                        className="object-contain w-full h-full rounded-lg"
                      />
                    )}
                </div>
              </div>
            )}
            <div className="h-full w-full flex flex-col gap-2 truncate">
              <h2 className="text-base font-semibold">
                {isFolder
                  ? (selection as CloudinaryFolder).__meta.name
                  : `${(selection as CloudinaryFile)?.secure_url
                      ?.split("/")
                      .pop()}`}
              </h2>
              {!isFolder && (
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>
                    {(selection as CloudinaryFile).resource_type}/
                    {(selection as CloudinaryFile).format ||
                      (selection as CloudinaryFile)?.secure_url
                        ?.split("/")
                        ?.pop()
                        ?.split(".")
                        ?.pop()}{" "}
                  </span>
                  <span>●</span>
                  <span>
                    {formatBytes((selection as CloudinaryFile).bytes)}
                  </span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-1">
                <h3 className="text-xs text-muted-foreground">Created On</h3>
                <p className="text-[13px] text-muted-foreground font-medium">
                  {new Date(selection.created_at).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                {!isFolder && (
                  <Button
                    onClick={handleCopy}
                    variant={"outline"}
                    size={"sm"}
                    className="bg-transparent text-muted-foreground hover:text-muted-foreground cursor-pointer"
                  >
                    {isCopied ? <Check className="size-4 mx-5" /> : "Copy URL"}
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className="bg-red-500/20 border border-red-500/40 text-red-500 hover:bg-red-500/30 hover:text-red-500/90 cursor-pointer"
                  onClick={() => onDelete(selection)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Keybindy>
  );
};
