"use client";

import FileBrowser from "./components/FileBrowser";
import { cn } from "@/utils";
import { useMediaView } from "./hooks/useMediaView";
import { SelectionDetails } from "./components/SelectionDetails";
import {
  AddFolderDialog,
  DeleteConfirmationDialog,
  RenameDialog,
} from "./components/Dialogs";

const AdminMediaView = () => {
  const {
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
  } = useMediaView();

  return (
    <div className="w-full h-full bg-fd-card/75 rounded-md border flex flex-col lg:flex-row justify-between">
      <div
        className={cn(
          "overflow-y-auto scrollbar-auto",
          selection ? "w-full lg:w-[60%] h-[60%] lg:h-full" : "w-full h-full"
        )}
      >
        <FileBrowser
          setSelection={setSelection}
          onRequestDelete={handleRequestDelete}
          onUploadFile={handleFileUpload}
          onRename={openRenameDialog}
          onRequestAddFolder={handleRequestAddFolder}
          isUploading={isUploading}
        />
      </div>
      <SelectionDetails
        selection={selection}
        onClose={() => setSelection(null)}
        onDelete={handleRequestDelete}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        isDeleting={isDeleting}
        targetName={
          deleteTarget?.__meta
            ? deleteTarget.__meta.name
            : `${deleteTarget?.secure_url.split("/").pop().substring(0, 20)}...`
        }
      />

      <RenameDialog
        isOpen={!!renameTarget}
        onOpenChange={() => setRenameTarget(null)}
        onConfirm={handleRename}
        isRenaming={isRenaming}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <AddFolderDialog
        isOpen={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
        onConfirm={handleAddFolder}
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        isAdding={isAddingFolder}
      />
    </div>
  );
};

export default AdminMediaView;
