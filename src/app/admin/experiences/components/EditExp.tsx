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
import { ExperienceType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ExperienceSchema } from "@/validation/zod";
import ExperienceForm from "./ExpForm";

const EditExperience = ({
  children,
  experience,
  onUpdate,
}: {
  children: React.ReactNode;
  experience: ExperienceType;
  onUpdate?: (updated: boolean) => void;
}) => {
  const [formData, setFormData] = useState<Partial<ExperienceType>>({
    company: experience.company,
    start: experience.start,
    end: experience.end,
    role: experience.role,
    description: experience.description,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    setFormData({
      company: experience.company,
      start: experience.start,
      end: experience.end,
      role: experience.role,
      description: experience.description,
    });

    return () => {
      setFormData({
        company: "",
        start: new Date(),
        end: undefined,
        role: "",
        description: "",
      });
      setIsSaving(false);
      setCurrentPage(0);
    };
  }, [experience]);

  const handleSave = async () => {
    if (!experience.id) {
      toast.info("Experience ID is required to update.");
      return;
    }

    const result = ExperienceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      Object.keys(fieldErrors).forEach((field) => {
        // @ts-expect-error: zod error messages
        toast.error(fieldErrors[field][0]);
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await axios.put(
        `${window.location.pathname}/api`,
        formData,
        {
          headers: {
            "x-api-key": API_KEY,
            "x-exp-id": experience.id,
          },
        }
      );

      toast.success(data.message || "Experience updated successfully.");
      onUpdate?.(true);
      router.refresh();
      dialogCloseRef.current?.click();
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
      <Dialog>
        <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
          {children}
        </DialogTrigger>
        <DialogContent
          closeRef={dialogCloseRef}
          className="sm:!w-[calc(100vw-2rem)] md:w-full max-w-full md:max-w-4xl max-h-[calc(100vh-2rem)]"
        >
          <DialogHeader>
            <DialogTitle>Edit Your Experience</DialogTitle>
            <DialogDescription>
              Update the details of your experience for the company{" "}
              <strong>{experience.company}</strong>
            </DialogDescription>
          </DialogHeader>

          <ExperienceForm
            page={currentPage}
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex justify-between mt-6">
            {currentPage > 0 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
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
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditExperience;
