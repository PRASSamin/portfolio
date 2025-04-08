import { useState, ChangeEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader, X } from "lucide-react";
import { upload } from "@/utils/uploadToCloudinary";
import { RawProjectType } from "@/types";
import MarkdownEditor from "@/components/MarkdownEditor";
import { motion } from "motion/react";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FontIcons, FontIconsData } from "@/constants/FontIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { toast } from "sonner";
import { ProjectSchema } from "@/validation/zod";
import { useSonner } from "@/hooks/useSonner";

type ProjectFormProps = {
  onChange?: (data: Partial<RawProjectType>) => void;
  page: number;
  formData: Partial<RawProjectType>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<RawProjectType>>>;
};

const ProjectForm = ({
  onChange,
  page,
  formData,
  setFormData,
}: ProjectFormProps) => {
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [mdHtml, setMdHtml] = useState("");
  const [searchedTools, setSearchedTools] =
    useState<Array<FontIconsData>>(FontIcons);
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
    const result = ProjectSchema.safeParse({ ...formData, [name]: value });
    if (!result.success && !["github", "live"].includes(name)) {
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
      const url = await upload({ file, folder: "pras/portfolio/projects" });
      setFormData((prev) => {
        const updated = { ...prev, image: url };
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

  const handleSelectTool = (code: number) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        tools: prev?.tools?.includes(code)
          ? prev?.tools?.filter((t) => t !== code)
          : [...(prev?.tools || []), code],
      };
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <motion.div
        className="flex w-[200%]"
        animate={{ x: page === 0 ? "0%" : "-50%" }}
        transition={{ duration: 0.4 }}
      >
        {/* Page 1: Project Form */}
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
                value={formData.image}
                readOnly
                onClick={async () => {
                  if (formData.image) {
                    window.open(formData.image, "_blank");
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
                        const updated = { ...prev, image: clipboardText };
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
            <Input
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="GitHub URL"
            />
            <Input
              name="live"
              value={formData.live}
              onChange={handleChange}
              placeholder="Live URL"
            />
            <div className="relative">
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
              />
              <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
            </div>
            <Dialog>
              <DialogTrigger>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[50px] cursor-pointer hover:border-white/30 transition-all duration-300">
                  {formData?.tools?.map((code) => {
                    const tool = FontIcons.find((t) => t.code === code);
                    return tool ? (
                      <div
                        key={code}
                        className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md relative group"
                      >
                        <span className="icons">
                          {String.fromCharCode(code)}
                        </span>
                        <span>{tool.name}</span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTool(code);
                          }}
                          className="w-full h-full bg-background hover:bg-background/80 text-white transition-all duration-300 absolute top-0 left-0 group-hover:opacity-100 opacity-0"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="text-lg font-semibold">
                  Select Tools
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Tool selection dialog
                </DialogDescription>
                <div className="grid grid-cols-4 gap-3 max-h-80 overflow-auto">
                  {searchedTools.map((tool) => (
                    <button
                      key={tool.code}
                      onClick={() => handleSelectTool(tool.code)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-5 border rounded-md hover:bg-muted/30",
                        formData?.tools?.includes(tool.code) && "bg-muted/30"
                      )}
                      aria-label={`Select ${tool.name}`}
                    >
                      <span className="text-2xl icons" data-code={tool.code}>
                        {String.fromCharCode(tool.code)}
                      </span>
                      <span className="text-xs">{tool.name}</span>
                    </button>
                  ))}
                </div>
                <Input
                  name="search"
                  placeholder="Search..."
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    const filteredTools = FontIcons.filter(
                      (tool) =>
                        tool.name.toLowerCase().includes(value) ||
                        tool.code.toString().includes(value)
                    );
                    setSearchedTools(filteredTools);
                  }}
                  className="mt-3 w-full focus-visible:ring-0 bg-muted text-white py-2 rounded-md"
                />
              </DialogContent>
            </Dialog>
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

export default ProjectForm;
