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
import { ExperienceType } from "@/types";
import { useRouter } from "next/navigation";
import { ExperienceSchema } from "@/validation/zod";
import ExperienceForm from "./ExpForm";

const AddExperience = ({
  onAdded,
  children,
}: {
  onAdded?: (updated: boolean) => void;
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<Partial<ExperienceType>>({
    company: "",
    start: new Date(),
    end: undefined,
    role: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const resetState = () => {
    setFormData({
      company: "",
      start: new Date(),
      end: undefined,
      role: "",
      description: "",
    });
    setIsAdding(false);
    setCurrentPage(0);
  };

  useEffect(() => {
    return resetState();
  }, []);

  const handleSave = async () => {
    const result = ExperienceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      Object.keys(fieldErrors).forEach((field) => {
        // @ts-expect-error: zod error message
        toast.error(fieldErrors[field][0]);
      });
      return;
    }

    setIsAdding(true);

    try {
      const { data } = await axios.post(
        `/api/admin/handle/experience`,
        formData,
        { headers: { "x-api-key": API_KEY } }
      );

      toast.success(data.message || "Experience added successfully.");
      onAdded?.(true);
      resetState();
      router.refresh();
      dialogCloseRef.current?.click();
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
            <DialogTitle>Add Professional Experience</DialogTitle>
            <DialogDescription>
              Please provide accurate details about your role, company, and
              duration to help build a stronger profile.
            </DialogDescription>
          </DialogHeader>

          <ExperienceForm
            formData={formData}
            setFormData={setFormData}
            page={currentPage}
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
                disabled={isAdding}
              >
                {isAdding ? (
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

export default AddExperience;
