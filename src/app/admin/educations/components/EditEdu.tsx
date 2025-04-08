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
import { EducationType } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { EducationSchema } from "@/validation/zod";
import EduForm from "./EduForm";
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
  const [formData, setFormData] = useState<Partial<EducationType>>({
    school: education.school,
    start: education.start,
    end: education.end,
    degree: education.degree,
    description: education.description,
    field: education.field,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    setFormData({
      school: education.school,
      start: education.start,
      end: education.end,
      degree: education.degree,
      description: education.description,
      field: education.field,
    });

    return () => {
      setFormData({
        school: "",
        start: new Date(),
        end: undefined,
        degree: "",
        description: "",
        field: "",
      });
      setIsSaving(false);
      setCurrentPage(0);
    };
  }, [education]);

  const handleSave = async () => {
    if (!education.id) return toast.info("Education ID is required.");
    const result = EducationSchema.safeParse(formData);
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
      const { data } = await axios.put(
        `/api/admin/handle/education`,
        formData,
        {
          headers: { "x-api-key": API_KEY, "x-education-id": education.id },
        }
      );
      setCurrentPage(0);
      toast.success(data.message);
      onUpdate?.(true);
      router.refresh();
      dialogCloseRef.current?.click();
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to save education");
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
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>
              Update the details of your education.
            </DialogDescription>
          </DialogHeader>

          <EduForm
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

export default EditEducation;
