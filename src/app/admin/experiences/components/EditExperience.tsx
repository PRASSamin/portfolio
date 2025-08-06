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
import { ExperienceType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ExperienceForm from "./ExperienceForm";

const EditExperience = ({
  children,
  experience,
  onUpdate,
}: {
  children: React.ReactNode;
  experience: ExperienceType;
  onUpdate?: (updated: boolean) => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const initialData: Partial<ExperienceType> = {
    company: experience.company,
    start: experience.start,
    end: experience.end,
    role: experience.role,
    description: experience.description,
  };

  const handleSave = async (formData: Partial<ExperienceType>) => {
    if (!experience.id) {
      toast.info("Experience ID is required to update.");
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await axios.put(
        `${window.location.pathname}/api`,
        formData,
        {
          headers: {
            "x-exp-id": experience.id,
          },
        }
      );

      toast.success(data.message || "Experience updated successfully.");
      onUpdate?.(true);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error(
        "Something went wrong while saving changes. Please try again."
      );
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
            <DialogTitle>Edit Your Experience</DialogTitle>
            <DialogDescription>
              Update the details of your experience for the company{" "}
              <strong>{experience.company}</strong>
            </DialogDescription>
          </DialogHeader>

          {isOpen && (
            <ExperienceForm
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

export default EditExperience;
