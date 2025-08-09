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
import { EducationType } from "@/types";
import EduForm from "./EducationForm";
import { useRouter } from "next/navigation";
import { Keybindy } from "@keybindy/react";

const AddEducation = ({
  onAdded,
  children,
}: {
  onAdded?: (updated: boolean) => void;
  children: React.ReactNode;
}) => {
  const oneYearAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const initialData: Partial<EducationType> = {
    school: "",
    start: oneYearAgo,
    end: new Date(),
    degree: "",
    description: "",
    field: "",
  };

  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSave = async (formData: Partial<EducationType>) => {
    setIsAdding(true);

    try {
      const { data } = await axios.post(
        `${window.location.pathname}/api`,
        formData
      );
      toast.success(data.message);
      onAdded?.(true);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to save education");
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
              description: `Add New Education`,
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
            <DialogTitle>Add Education</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new education entry to your
              profile.
            </DialogDescription>
          </DialogHeader>

          {isOpen && (
            <EduForm
              initialData={initialData}
              onSubmit={handleSave}
              isSubmitting={isAdding}
              submitButtonText="Add Education"
            />
          )}
        </DialogContent>
      </Dialog>
    </Keybindy>
  );
};

export default AddEducation;
