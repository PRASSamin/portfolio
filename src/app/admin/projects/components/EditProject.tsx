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
import { ProjectType, RawProjectType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectForm from "./ProjectForm";
import { toast } from "sonner";
import { ProjectSchema } from "@/validation/zod";

const EditProject = ({
  project,
  onUpdate,
  onEditClick,
}: {
  project: ProjectType;
  onUpdate?: (updated: boolean) => void;
  onEditClick?: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<RawProjectType>>({
    title: project.title,
    description: project.description,
    image: project.image,
    github: project.link.github,
    live: project.link.live,
    category: project.category,
    tools: project.tools,
    content: project.content || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      github: project.link.github,
      live: project.link.live,
      category: project.category,
      tools: project.tools,
      content: project.content || "",
    });

    return () => {
      setFormData({
        title: "",
        description: "",
        image: "",
        github: "",
        live: "",
        category: "",
        tools: [],
        content: "",
      });
      setIsSaving(false);
      setCurrentPage(0);
    };
  }, [project]);

  const handleSave = async () => {
    if (!project.id) return toast.info("Project ID is required.");
    const result = ProjectSchema.safeParse(formData);
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
      await axios.put(`${window.location.pathname}/api`, formData, {
        headers: { "x-api-key": API_KEY, "x-project-id": project.id },
      });
      setCurrentPage(0);
      toast.success("Project updated successfully!");
      onUpdate?.(true);
      dialogCloseRef.current?.click();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger
          ref={dialogTriggerRef}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.();
          }}
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
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project and save.
            </DialogDescription>
          </DialogHeader>

          <ProjectForm
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

export default EditProject;
