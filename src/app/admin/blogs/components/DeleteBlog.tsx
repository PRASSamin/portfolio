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
import { BlogType } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteBlog = ({
  children,
  ids,
  setIds,
  blogs,
}: {
  children: React.ReactNode;
  ids: Set<string | number>;
  setIds?: React.Dispatch<Set<string | number>>;
  blogs: BlogType[];
}) => {
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const router = useRouter();

  const handleDelete = async (ids: (string | number)[]) => {
    setIsDeleting(ids[0]);

    try {
      const response = await axios.delete(`${window.location.pathname}/api`, {
        headers: {
          "x-api-key": API_KEY,
        },
        params: { id: ids },
        paramsSerializer: (params) => {
          return params.id.map((id: string | number) => `id=${id}`).join("&");
        },
      });

      if (response.status === 200) {
        toast.success(`${response.data.count} blog(s) deleted successfully!`);
        setIds?.(new Set());
        router.refresh();
      } else {
        throw new Error("Failed to delete blogs");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error("Failed to delete blogs. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Dialog modal key={blogs.length}>
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
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-1 mt-10">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete(Array.from(ids))}
            className="bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-300"
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBlog;
