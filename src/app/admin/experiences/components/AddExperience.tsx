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
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ExperienceType } from "@/types";
import { useRouter } from "next/navigation";
import ExperienceForm from "./ExperienceForm";
import { Keybindy } from "@keybindy/react";

const AddExperience = ({
  onAdded,
  children,
}: {
  onAdded?: (updated: boolean) => void;
  children: React.ReactNode;
}) => {
  const oneYearAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const initialData: Partial<ExperienceType> = {
    company: "",
    start: oneYearAgo,
    end: new Date(),
    role: "",
    description: "",
  };

  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (formData: Partial<ExperienceType>) => {
    setIsAdding(true);

    try {
      const { data } = await axios.post(
        `${window.location.pathname}/api`,
        formData
      );

      toast.success(data.message || "Experience added successfully.");
      onAdded?.(true);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save experience:", error);
      toast.error(
        "An error occurred while saving your experience. Please try again."
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Keybindy
      shortcuts={[
        {
          keys: ["Alt", "N"],
          handler: async () => {
            setIsOpen(true);
          },
          options: {
            data: {
              description: `Add New Experience`,
              group: "On this page",
            },
          },
        },
      ]}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:w-[calc(100vw-2rem)]! md:w-full max-w-full md:max-w-4xl max-h-[calc(100vh-2rem)]">
          <DialogHeader>
            <DialogTitle>Add Professional Experience</DialogTitle>
            <DialogDescription>
              Please provide accurate details about your role, company, and
              duration to help build a stronger profile.
            </DialogDescription>
          </DialogHeader>

          {isOpen && (
            <ExperienceForm
              initialData={initialData}
              onSubmit={handleSave}
              isSubmitting={isAdding}
              submitButtonText="Add Experience"
            />
          )}
        </DialogContent>
      </Dialog>
    </Keybindy>
  );
};

export default AddExperience;
