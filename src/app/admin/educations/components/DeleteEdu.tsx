import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_KEY } from "@/constants/env";
import { EducationType } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteEdu = ({
  children,
  education,
}: {
  children: React.ReactNode;
  education: EducationType;
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete(`${window.location.pathname}/api`, {
        headers: {
          "x-api-key": API_KEY,
        },
        params: { id: education.id },
      });

      if (response.status === 200) {
        toast.success(
          `Education "${response.data.deleted.degree}" was deleted successfully.`
        );
        router.refresh();
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error deleting education:", error);
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while deleting education."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog modal key={education.id}>
      <DialogTrigger
        asChild
        onClick={(e) => e.stopPropagation()}
        className="w-full"
      >
        {children}
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete the education entry for{" "}
            <strong>{education.degree}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-1 mt-10">
          <DialogClose asChild>
            <Button variant="secondary" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/20 border border-red-500/40 rounded-lg text-red-500 hover:bg-red-500/30 transition-all duration-300"
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEdu;
