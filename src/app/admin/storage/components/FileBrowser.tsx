"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Files } from "fumadocs-ui/components/files";
import { toast } from "sonner";
import FolderView from "./FolderView";
import { useMediaStore } from "../stores/media";
import { CloudinaryFile, CloudinaryFolder } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { File, Folder } from "fumadocs-ui/components/files";

interface FileBrowserProps {
  setSelection: (selection: CloudinaryFile | CloudinaryFolder | null) => void;
  onRequestDelete: (item: CloudinaryFile | CloudinaryFolder) => void;
  onUploadFile: (file: File, path: string) => void;
  onRename: (item: CloudinaryFile | CloudinaryFolder) => void;
  onRequestAddFolder: (path: string) => void;
  isUploading: boolean;
}

const FileBrowser = ({
  setSelection,
  onRequestDelete,
  onUploadFile,
  onRename,
  onRequestAddFolder,
  isUploading,
}: FileBrowserProps) => {
  const { structure, setStructure } = useMediaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${window.location.pathname}/api`);
        setStructure(data.structure);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Failed to load Cloudinary media.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(structure).length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [setStructure, structure]);

  if (loading)
    return (
      <div className="p-4">
        <Files className="border-0 bg-transparent w-full">
          <Folder name="pras" defaultOpen className="[&>button]:bg-muted">
            {Array.from({ length: 3 }).map((_, index) => (
              <Folder
                defaultOpen
                name=""
                key={index}
                className="mt-2 [&>button]:bg-muted [&>button]:py-3.5 [&_svg]:hidden animate-pulse"
              >
                {Array.from({ length: Math.floor(Math.random() * 8) + 1 }).map(
                  (_, index) => (
                    <File
                      name=""
                      key={index}
                      className="mt-2 bg-muted py-3.5 [&_svg]:hidden animate-pulse"
                    />
                  )
                )}
              </Folder>
            ))}
          </Folder>
        </Files>
      </div>
    );

  return (
    <div className="p-4">
      <Files className="border-0 bg-transparent w-full">
        {Object.values(structure).map((item: any) => (
          <FolderView
            key={item.__meta.path}
            folderData={item}
            setSelection={setSelection}
            onRequestDelete={onRequestDelete}
            onUploadFile={onUploadFile}
            onRename={onRename}
            onRequestAddFolder={onRequestAddFolder}
            isUploading={isUploading}
          />
        ))}
      </Files>
    </div>
  );
};

export default FileBrowser;
