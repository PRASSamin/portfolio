import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { API_KEY } from "@/constants/env";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { BlogType } from "@/types";
import { BlogSchema } from "@/validation/zod";
import BlogForm from "./BlogForm";

const AddBlog = ({
  onAdded,
  children,
}: {
  onAdded?: (updated: boolean) => void;
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<Partial<BlogType>>({
    title: "",
    description: "",
    tags: [],
    thumbnail: "",
    content: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const resetState = () => {
    setFormData({
      title: "",
      description: "",
      tags: [],
      thumbnail: "",
      content: "",
    });
    setIsAdding(false);
    setCurrentPage(0);
  };

  useEffect(() => {
    return resetState();
  }, []);

  const handleSave = async () => {
    const result = BlogSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;

      Object.keys(fieldErrors).forEach((field) => {
        // @ts-expect-error: types issue
        toast.error(fieldErrors[field][0]);
      });

      return;
    }
    setIsAdding(true);

    try {
      await axios.post(`/api/admin/handle/blog`, formData, {
        headers: { "x-api-key": API_KEY },
      });
      setCurrentPage(0);
      toast.success("Blog added successfully!");
      onAdded?.(true);
      resetState();
      dialogCloseRef.current?.click();
    } catch (error) {
     console.error("Error updating blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
          {children}
        </DialogTrigger>
        <DialogContent
          closeRef={dialogCloseRef}
          className="sm:!w-[calc(100vw-2rem)] md:w-full max-w-full md:max-w-4xl max-h-[calc(100vh-2rem)]"
        >
          <DialogHeader>
            <DialogTitle>Add Blog</DialogTitle>
            <DialogDescription>Add a new blog</DialogDescription>
          </DialogHeader>

          <BlogForm
            formData={formData}
            setFormData={setFormData}
            page={currentPage}
          />

          <div className="flex justify-between mt-4">
            {currentPage > 0 ? (
              <Button onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </Button>
            ) : (
              <div />
            )}
            {currentPage < 1 ? (
              <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isAdding}
              >
                {isAdding ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default AddBlog;
