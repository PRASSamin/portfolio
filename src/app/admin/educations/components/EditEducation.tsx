import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { EducationType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import EduForm from "./EducationForm";
import { useRouter } from "next/navigation";

const EditEducation = ({
  children,
  education,
  onUpdate,
}: {
  children: React.ReactNode;
  education: EducationType;
  onUpdate?: (updated: boolean) => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const initialData: Partial<EducationType> = {
    school: education.school,
    start: education.start,
    end: education.end,
    degree: education.degree,
    description: education.description,
    field: education.field,
  };

  const handleSave = async (formData: Partial<EducationType>) => {
    if (!education.id) return toast.info("Education ID is required.");

    setIsSaving(true);
    try {
      const { data } = await axios.put(
        `${window.location.pathname}/api`,
        formData,
        {
          headers: { "x-education-id": education.id },
        }
      );
      toast.success(data.message);
      onUpdate?.(true);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to save education");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:w-[calc(100vw-2rem)]! md:w-full max-w-full md:max-w-4xl max-h-[calc(100vh-2rem)]">
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>
              Update the details of your education.
            </DialogDescription>
          </DialogHeader>

          {isOpen && (
            <EduForm
              initialData={initialData}
              onSubmit={handleSave}
              isSubmitting={isSaving}
              submitButtonText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditEducation;
