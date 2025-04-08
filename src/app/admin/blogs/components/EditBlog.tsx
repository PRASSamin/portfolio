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
import { FilePenLine, Loader2 } from "lucide-react";
import axios from "axios";
import { API_KEY } from "@/constants/env";
import { BlogType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { BlogSchema } from "@/validation/zod";
import BlogForm from "./BlogForm";

const EditBlog = ({
  blog,
  onUpdate,
}: {
  blog: BlogType;
  onUpdate?: (updated: boolean) => void;
}) => {
  const [formData, setFormData] = useState<Partial<BlogType>>({
    title: blog.title,
    description: blog.description,
    tags: blog.tags || [],
    thumbnail: blog.thumbnail,
    content: blog.content || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFormData({
      title: blog.title,
      description: blog.description,
      tags: blog.tags || [],
      thumbnail: blog.thumbnail,
      content: blog.content || "",
    });

    return () => {
      setFormData({
        title: "",
        description: "",
        tags: [],
        thumbnail: "",
        content: "",
      });
      setIsSaving(false);
      setCurrentPage(0);
    };
  }, [blog]);

  const handleSave = async () => {
    if (!blog.id) return toast.info("Blog ID is required.");
    const result = BlogSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;

      Object.keys(fieldErrors).forEach((field) => {
        // @ts-expect-error: types issue
        toast.error(fieldErrors[field][0]);
      });

      return;
    }

    setIsSaving(true);
    try {
      await axios.put(`/api/admin/handle/blog`, formData, {
        headers: { "x-api-key": API_KEY, "x-blog-id": blog.id },
      });
      setCurrentPage(0);
      toast.success("Blog updated successfully!");
      onUpdate?.(true);
      dialogCloseRef.current?.click();
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger
          onClick={(e) => e.stopPropagation()}
          className="gap-2 group  flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent hover:bg-muted cursor-pointer w-full"
        >
          <FilePenLine
            size={18}
            className="group-hover:text-green-400 transition-all duration-300"
          />
          Edit
        </DialogTrigger>
        <DialogContent
          closeRef={dialogCloseRef}
          className="sm:!w-[calc(100vw-2rem)] md:w-full max-w-full md:max-w-4xl max-h-[calc(100vh-2rem)]"
        >
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>
              Make changes to your blog and save.
            </DialogDescription>
          </DialogHeader>

          <BlogForm
            page={currentPage}
            formData={formData}
            setFormData={setFormData}
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
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditBlog;
