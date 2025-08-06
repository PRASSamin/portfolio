import { File, Folder } from "fumadocs-ui/components/files";
import Image from "next/image";
import React from "react";
import { FileHeader, FolderHeader } from "./Headers";
import { CloudinaryFolder } from "@/types";
import {
  Film,
  Music4,
  FileText,
  FileArchive,
  File as FileIcon,
} from "lucide-react";
import { SVGIcon } from "@/components/icons/svg";

const FolderView = React.memo(function FolderView({
  folderData,
  setSelection,
  onRequestDelete,
  onUploadFile,
  onRename,
  onRequestAddFolder,
  isUploading,
}: {
  folderData: CloudinaryFolder;
  setSelection: React.Dispatch<React.SetStateAction<any>>;
  onRequestDelete: (item: any) => void;
  onUploadFile: (file: File, path: string) => void;
  onRename: (item: any) => void;
  onRequestAddFolder: (path: string) => void;
  isUploading: boolean;
}) {
  if (!folderData?.__meta) return null;

  return (
    <Folder
      key={folderData.__meta.path}
      name={
        (
          <FolderHeader
            folderData={folderData}
            onRequestDelete={onRequestDelete}
            onUploadFile={onUploadFile}
            onRename={onRename}
            onRequestAddFolder={onRequestAddFolder}
            isUploading={isUploading}
          />
        ) as any
      }
      defaultOpen
    >
      {/* Render child folders */}
      {Object.entries(folderData).map(([key, value]) => {
        if (key !== "__meta" && key !== "files") {
          return (
            <FolderView
              key={value.__meta.path}
              folderData={value}
              setSelection={setSelection}
              onRequestDelete={onRequestDelete}
              onUploadFile={onUploadFile}
              onRename={onRename}
              isUploading={isUploading}
              onRequestAddFolder={onRequestAddFolder}
            />
          );
        }
        return null;
      })}

      {/* Render files */}
      {folderData.files?.map((file: any) => {
        const ext = file.secure_url?.split("/")?.pop()?.split(".")?.pop();
        const fType = filetype(ext);
        return (
          <File
            key={file.asset_id}
            onClick={() => setSelection(file)}
            icon={
              fType === "image" ? (
                <Image
                  src={file.secure_url}
                  width={20}
                  height={20}
                  alt=""
                  className="object-cover aspect-square"
                />
              ) : fType === "video" ? (
                <Film />
              ) : fType === "audio" ? (
                <Music4 />
              ) : fType === "document" ? (
                <FileText />
              ) : fType === "archive" ? (
                <FileArchive />
              ) : fType === "svg" ? (
                <SVGIcon />
              ) : (
                <FileIcon />
              )
            }
            name={
              (
                <FileHeader
                  file={file}
                  onRename={onRename}
                  onRequestDelete={onRequestDelete}
                  setSelection={setSelection}
                />
              ) as any
            }
          />
        );
      })}
    </Folder>
  );
});

export default FolderView;

const filetype = (ext: string) => {
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "webm", "ogg"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext))
    return "document";
  if (["zip", "rar", "7z"].includes(ext)) return "archive";
  if (ext === "svg") return "svg";
  return "file";
};