import { useState, ChangeEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader, X } from "lucide-react";
import { upload } from "@/utils/uploadToCloudinary";
import { BlogType } from "@/types";
import MarkdownEditor from "@/components/MarkdownEditor";
import { motion } from "motion/react";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlogSchema } from "@/validation/zod";
import { useSonner } from "@/hooks/useSonner";

type BlogFormProps = {
  onChange?: (data: Partial<BlogType>) => void;
  page: number;
  formData: Partial<BlogType>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BlogType>>>;
};

const BlogForm = ({ onChange, page, formData, setFormData }: BlogFormProps) => {
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [mdHtml, setMdHtml] = useState("");
  const { resetOptions, setOptions } = useSonner();
  const contentPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setMdHtml(await prepareMarkdown(formData.content || ""));

      if (contentPreviewRef.current) {
        contentPreviewRef.current.scrollTop =
          contentPreviewRef.current.scrollHeight;
      }
    })();
  }, [formData.content]);

  useEffect(() => {
    setOptions({
      position: "top-right",
      expand: true,
      visibleToasts: 6,
    });

    return () => {
      resetOptions();
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const result = BlogSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      // @ts-expect-error: types issue
      if (fieldError[name]) {
        // @ts-expect-error: types issue
        toast.error(fieldError[name][0]);
      }
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      onChange?.(updated);

      return updated;
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsThumbnailUploading(true);
    try {
      const url = await upload({ file, folder: "pras/portfolio/blogs" });
      setFormData((prev) => {
        const updated = { ...prev, thumbnail: url };
        onChange?.(updated);
        return updated;
      });
    } catch (error) {
      console.error("Thumbnail upload failed:", error);
      toast.error("Failed to upload thumbnail");
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleTagInput = (value: string) => {
    if (value.trim()) {
      setFormData((prev) => {
        const updatedTags = [...(prev.tags || []), value.trim()];
        onChange?.({ ...prev, tags: updatedTags });
        return { ...prev, tags: updatedTags };
      });
      return true;
    }
    return false;
  };

  const handleTagRemove = (index: number) => {
    setFormData((prev) => {
      const updatedTags = prev.tags?.filter((_, i) => i !== index) || [];
      onChange?.({ ...prev, tags: updatedTags });
      return { ...prev, tags: updatedTags };
    });
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <motion.div
        className="flex w-[200%]"
        animate={{ x: page === 0 ? "0%" : "-50%" }}
        transition={{ duration: 0.4 }}
      >
        {/* Page 1: Blog Form */}
        <div className="w-1/2">
          <div className="flex flex-col gap-4 p-1">
            <div className="relative">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
              />
              <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
            </div>
            <div className="relative">
              <Input
                name="thumbnail"
                value={formData?.thumbnail}
                readOnly
                onClick={async () => {
                  if (formData?.thumbnail) {
                    window.open(formData?.thumbnail, "_blank");
                  } else {
                    const clipboardText = await navigator.clipboard.readText();

                    let isValidUrl = false;
                    try {
                      new URL(clipboardText);
                      isValidUrl = true;
                    } catch (_) {
                      isValidUrl = false;
                    }

                    if (isValidUrl) {
                      setFormData((prev) => {
                        const updated = { ...prev, thumbnail: clipboardText };
                        onChange?.(updated);
                        return updated;
                      });
                    } else {
                      toast.error("Thumbnail URL is not valid");
                    }
                  }
                }}
                placeholder="Upload Thumbnail"
                className="pr-12 cursor-pointer"
              />
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="thumbnailSelect"
                onChange={handleFileChange}
              />
              <label
                htmlFor="thumbnailSelect"
                className="absolute top-1/2 right-1 -translate-y-1/2 hover:bg-muted cursor-pointer h-[75%] aspect-square flex items-center justify-center [&>svg]:size-4 rounded transition-all duration-300"
              >
                {isThumbnailUploading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Upload />
                )}
              </label>
              <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
            </div>
            <div
              className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[50px] cursor-text hover:border-white/30 transition-all duration-300"
              onClick={() => document.getElementById("tagInput")?.focus()}
            >
              {formData?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md font-mono relative group"
                >
                  <span>{tag}</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagRemove(index);
                    }}
                    className="w-full h-full bg-background hover:bg-background/80 text-white transition-all duration-300 absolute top-0 left-0 group-hover:opacity-100 opacity-0"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
              <input
                id="tagInput"
                type="text"
                className="bg-transparent outline-none"
                onKeyDown={(e) => {
                  const inputValue = e.currentTarget.value.trim();
                  const key = e.key.toLowerCase();

                  if (
                    key === "backspace" &&
                    !inputValue &&
                    formData.tags?.length
                  ) {
                    handleTagRemove(formData.tags.length - 1);
                  }

                  if ((key === " " || key === "enter") && inputValue) {
                    const value = handleTagInput(e.currentTarget.value);
                    if (value) {
                      e.currentTarget.value = "";
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = handleTagInput(e.target.value);
                  if (value) {
                    e.target.value = "";
                  }
                }}
                placeholder="Add tags..."
              />
            </div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description"
              rows={5}
            />
          </div>
        </div>

        {/* Page 2: Markdown Editor & Preview */}
        <div className="w-1/2 flex flex-col gap-4 p-1 h-[75vh] scrollbar-show">
          <div className="h-1/2 flex flex-col">
            <MarkdownEditor
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => {
                  const updated = { ...prev, content: value || "" };
                  onChange?.(updated);
                  return updated;
                })
              }
            />
          </div>
          <div className="border p-3 rounded-md bg-muted/40 overflow-auto h-1/2">
            <div
              ref={contentPreviewRef}
              className="prose dark:prose-invert markdown max-h-full min-w-full max-w-full overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: mdHtml }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogForm;
