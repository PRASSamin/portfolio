import React from "react";
import {
  CloudUpload,
  FolderPen,
  FolderPlus,
  Link,
  MoreHorizontal,
  TableProperties,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { CloudinaryFile, CloudinaryFolder } from "@/types";
import { toast } from "sonner";

export const FolderHeader = ({
  folderData,
  onRequestDelete,
  onRequestAddFolder,
  onUploadFile,
  onRename,
  isUploading,
}: {
  folderData: CloudinaryFolder;
  onRequestDelete: (item: any) => void;
  onUploadFile: (file: File, path: string) => void;
  onRename: (item: any) => void;
  onRequestAddFolder: (path: string) => void;
  isUploading: boolean;
}) => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div className="flex items-center justify-between w-full group">
      <span className="flex-1 truncate text-left">
        {folderData.__meta.name}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            onClick={handleMenuClick}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-muted" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                document
                  .getElementById(`upload-${folderData.__meta.path}`)
                  ?.click();
              }}
              disabled={isUploading}
            >
              <CloudUpload className="size-4" /> Upload file
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRequestAddFolder(folderData.__meta.path);
              }}
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
            >
              <FolderPlus className="size-4" /> Add Folder
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-muted-foreground/20" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(folderData);
              }}
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
            >
              <Trash className="size-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename(folderData);
              }}
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
            >
              <FolderPen className="size-4" /> Rename
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        id={`upload-${folderData.__meta.path}`}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onUploadFile(e.target.files[0], folderData.__meta.path);
          }
        }}
        disabled={isUploading}
      />
    </div>
  );
};

export const FileHeader = ({
  file,
  onRequestDelete,
  setSelection,
  onRename,
}: {
  file: CloudinaryFile;
  onRequestDelete: (item: CloudinaryFile) => void;
  setSelection: React.Dispatch<React.SetStateAction<any>>;
  onRename: (item: CloudinaryFile) => void;
}) => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const truncate = (name: string) => {
    const fileName = name.split(".").shift() || "";
    const extension = name.split(".").pop() || "";
    if (fileName.length > 20) {
      return `${fileName.substring(0, 20)}....${extension}`;
    }
    return `${fileName}.${extension}`;
  };
  return (
    <div className="flex items-center justify-between w-full group cursor-pointer">
      <span className="flex-1 truncate text-left">
        {truncate(file.secure_url.split("/").pop() || "")}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
            onClick={handleMenuClick}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={handleMenuClick}
          className="w-56 bg-muted"
          align="start"
        >
          <DropdownMenuItem
            onClick={() => {
              toast.success("URL copied to clipboard");
              copyToClipboard(file.secure_url);
            }}
            className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
          >
            <Link className="size-4" /> Copy URL
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-muted-foreground/20" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => onRequestDelete(file)}
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
            >
              <Trash className="size-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRename(file)}
              className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
            >
              <FolderPen className="size-4" /> Rename
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-muted-foreground/20" />
          <DropdownMenuItem
            onClick={() => setSelection(file)}
            className="hover:bg-muted-foreground/20 flex items-center gap-3 cursor-pointer"
          >
            <TableProperties className="size-4" /> Properties
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
