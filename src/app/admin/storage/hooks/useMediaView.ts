import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { CloudinaryFile, CloudinaryFolder } from "@/types";
import { useMediaStore } from "../stores/media";
import { CLOUDINARY_NAME, CLOUDINARY_PRESET } from "@/constants/env";

export const useMediaView = () => {
  const [selection, setSelection] = useState<
    CloudinaryFile | CloudinaryFolder | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameTarget, setRenameTarget] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [addFolderParent, setAddFolderParent] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const {
    deleteResource,
    deleteFolder,
    addResource,
    renameResource,
    addFolder,
  } = useMediaStore();

  const handleRequestDelete = (item: any) => {
    setDeleteTarget(item);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const isFolder = deleteTarget.__meta;
    const url = isFolder
      ? `${window.location.pathname}/api/folder?path=${deleteTarget.__meta.path}`
      : `${window.location.pathname}/api?public_id=${deleteTarget.public_id}`;

    try {
      const response = await axios.delete(url);

      if (response.status === 200) {
        toast.success(
          `Successfully deleted ${isFolder ? "folder" : "file"}: ${
            isFolder ? deleteTarget.__meta.name : deleteTarget.display_name
          }`
        );
        if (isFolder) {
          deleteFolder(deleteTarget.__meta.path);
        } else {
          deleteResource(deleteTarget.public_id);
        }
        if (selection?.public_id === deleteTarget.public_id) {
          setSelection(null);
        }
        setDeleteTarget(null);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error deleting:", error);
      toast.error(
        error?.response?.data?.error || "Something went wrong while deleting."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (file: File, path: string) => {
    if (!file) return;

    const toastId = toast.loading(`Uploading file "${file.name}"...`, {
      description: "Please wait.",
    });
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET!);
    formData.append("folder", path);
    formData.append("public_id", file.name?.split(".")?.shift() || "");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/auto/upload`,
        formData
      );
      addResource(response.data.public_id, response.data);
      toast.success("File uploaded successfully.", { id: toastId });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !newName) return;
    setIsRenaming(true);

    const isFolder = renameTarget?.__meta;
    const from = isFolder ? renameTarget.__meta.path : renameTarget.public_id;
    const to = isFolder
      ? `${renameTarget.__meta.path.substring(
          0,
          renameTarget.__meta.path.lastIndexOf("/")
        )}/${newName}`
      : `${newName}`;

    try {
      await axios.put(
        `${window.location.pathname}/api/rename`,
        isFolder
          ? { from, to, type: "folder" }
          : { to, type: "file", public_id: renameTarget.public_id }
      );
      renameResource(from, to);
      toast.success("Renamed successfully.");
      setRenameTarget(null);
      setNewName("");
    } catch (error) {
      console.error("Error renaming:", error);
      toast.error("Failed to rename.");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleRequestAddFolder = (path: string) => {
    setAddFolderParent(path);
    setIsAddFolderDialogOpen(true);
  };

  const handleAddFolder = async () => {
    if (!newFolderName) return;
    setIsAddingFolder(true);
    const path = `${addFolderParent}/${newFolderName}`.replace(/^\//, "");
    try {
      await axios.post(`${window.location.pathname}/api/folder`, { path });
      addFolder(path, { __meta: { name: newFolderName, path } });
      setNewFolderName("");
      setIsAddFolderDialogOpen(false);
      toast.success(`Folder "${newFolderName}" created successfully.`);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder.");
    } finally {
      setIsAddingFolder(false);
    }
  };

  const openRenameDialog = (item: any) => {
    setRenameTarget(item);
    setNewName(item.__meta ? item.__meta.name : item.display_name);
  };

  return {
    selection,
    setSelection,
    isDeleting,
    deleteTarget,
    setDeleteTarget,
    isUploading,
    isRenaming,
    renameTarget,
    setRenameTarget,
    newName,
    setNewName,
    isAddFolderDialogOpen,
    setIsAddFolderDialogOpen,
    newFolderName,
    setNewFolderName,
    isAddingFolder,
    handleRequestDelete,
    executeDelete,
    handleFileUpload,
    handleRename,
    handleRequestAddFolder,
    handleAddFolder,
    openRenameDialog,
  };
};
