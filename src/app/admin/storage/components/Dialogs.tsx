import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Keybindy } from "@keybindy/react";
import { Loader2 } from "lucide-react";
import { ChangeEvent } from "react";

interface DialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface DeleteConfirmationDialogProps extends DialogProps {
  onConfirm: () => void;
  isDeleting: boolean;
  targetName?: string;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
  targetName,
}: DeleteConfirmationDialogProps) => (
  <Keybindy>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong>{targetName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-1 mt-10">
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500/20 border border-red-500/40 rounded-lg text-red-500 hover:bg-red-500/30 transition-all duration-300 cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Keybindy>
);

interface RenameDialogProps extends DialogProps {
  onConfirm: () => void;
  isRenaming: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const RenameDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isRenaming,
  value,
  onChange,
}: RenameDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input value={value} onChange={onChange} />
      </div>
      <Button onClick={onConfirm} disabled={isRenaming}>
        {isRenaming ? "Renaming..." : "Rename"}
      </Button>
    </DialogContent>
  </Dialog>
);

interface AddFolderDialogProps extends DialogProps {
  onConfirm: () => void;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
}

export const AddFolderDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  value,
  onChange,
  isAdding,
}: AddFolderDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Folder</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input placeholder="Folder name" value={value} onChange={onChange} />
      </div>
      <Button onClick={onConfirm} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Folder"}
      </Button>
    </DialogContent>
  </Dialog>
);
