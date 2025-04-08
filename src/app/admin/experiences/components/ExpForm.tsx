import { ChangeEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ExperienceType } from "@/types";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ExperienceSchema } from "@/validation/zod";
import { useSonner } from "@/hooks/useSonner";
import DateRangeSelector from "../../../../components/DateRangeSelector";
import HtmlEditor from "@/components/HtmlEditor";

type ExperienceFormProps = {
  onChange?: (data: Partial<ExperienceType>) => void;
  page: number;
  formData: Partial<ExperienceType>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ExperienceType>>>;
};

const ExperienceForm = ({
  onChange,
  page,
  formData,
  setFormData,
}: ExperienceFormProps) => {
  const { resetOptions, setOptions } = useSonner();
  const contentPreviewRef = useRef<HTMLDivElement>(null);

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
    const result = ExperienceSchema.safeParse({ ...formData, [name]: value });
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

  return (
    <div className="relative overflow-hidden w-full h-full">
      <motion.div
        className="flex w-[200%]"
        animate={{ x: page === 0 ? "0%" : "-50%" }}
        transition={{ duration: 0.4 }}
      >
        {/* Page 1: Exp Form */}
        <div className="w-1/2">
          <div className="flex flex-col gap-4 p-1">
            <div className="relative">
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name(e.g. Google)"
              />
              <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
            </div>
            <div className="relative">
              <Input
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Job role(e.g. Software engineer)"
              />
              <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
            </div>
            <DateRangeSelector
              onChange={({ startDate, endDate }) => {
                setFormData((prev) => {
                  const updated = { ...prev, start: startDate, end: endDate };
                  onChange?.(updated);

                  return updated;
                });
              }}
              value={{ startDate: formData.start!, endDate: formData.end }}
            />
          </div>
        </div>

        {/* Page 2: Markdown Editor & Preview */}
        <div className="w-1/2 flex flex-col gap-4 p-1 h-[75vh] scrollbar-show">
          <div className="h-1/2 flex flex-col">
            <HtmlEditor
              defaultValue={formData.description || ""}
              onChange={(value) =>
                setFormData((prev) => {
                  const updated = { ...prev, description: value || "" };
                  onChange?.(updated);
                  return updated;
                })
              }
            />
          </div>
          <div className="border p-3 rounded-md bg-muted/40 overflow-auto h-1/2">
            <div
              ref={contentPreviewRef}
              className="max-h-full min-w-full max-w-full overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: formData.description || "" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExperienceForm;
