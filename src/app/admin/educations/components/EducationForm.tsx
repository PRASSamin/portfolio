import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { EducationType } from "@/types";
import { motion } from "motion/react";
import { toast } from "sonner";
import { EducationSchema } from "@/validation/zod";
import { useSonner } from "@/hooks/useSonner";
import DateRangeSelector from "@/components/DateRangeSelector";
import HtmlEditor from "@/components/HtmlEditor";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { MDXContent } from "mdx/types";
import { getMDXComponents, mdxComponents } from "@/mdx-components";
import { debounce } from "@/utils/debounce";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Keybindy } from "@keybindy/react";

type EducationFormProps = {
  initialData: Partial<EducationType>;
  onSubmit: (data: Partial<EducationType>) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
};

const EduForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = "Save",
}: EducationFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const { resetOptions, setOptions } = useSonner();
  const [CompiledComponent, setCompiledComponent] = useState<MDXContent | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [debounced, setDebounced] = useState(formData.description || "");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    const debouncedFn = debounce((value: string) => {
      setDebounced(value);
    }, 400);

    debouncedFn(formData.description || "");

    return debouncedFn.cancel;
  }, [formData.description]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);

        const { default: Content } = await evaluate(debounced, {
          ...runtime,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        });

        if (!cancelled) {
          setCompiledComponent(() => Content);
        }
      } catch (e: any) {
        if (!cancelled) {
          console.warn("MDX Compile Error:", e.message);
          setError(e.message || "Unknown MDX error");
          setCompiledComponent(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    setOptions({
      position: "top-right",
      expand: true,
      visibleToasts: 6,
    });

    return () => resetOptions();
  }, [resetOptions, setOptions]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const result = EducationSchema.safeParse({ ...formData, [name]: value });

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      // @ts-expect-error: zod typescript issue
      if (fieldError[name]) {
        // @ts-expect-error: zod typescript issue
        toast.error(fieldError[name][0]);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const result = EducationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      Object.keys(fieldErrors).forEach((field) => {
        // @ts-expect-error: zod error message
        toast.error(fieldErrors[field][0]);
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Keybindy
      shortcuts={[
        {
          keys: ["Enter"],
          handler(event, state) {
            if (currentPage === 1) {
              handleSubmit();
            } else {
              setCurrentPage((prev) => prev + 1);
            }
          },
          options: {
            data: {
              description: currentPage === 0 ? "Next" : "Submit",
              group: "On this page",
            },
          },
        },
        {
          keys: ["Ctrl", "Enter"],
          handler(event, state) {
            if (currentPage === 1) {
              setCurrentPage((prev) => prev - 1);
            }
          },
          options: {
            data: {
              description: currentPage === 0 ? "Previous" : "Previous",
              group: "On this page",
            },
          },
        },
      ]}
    >
      <div className="relative overflow-hidden w-full h-full">
        <motion.div
          className="flex w-[200%]"
          animate={{ x: currentPage === 0 ? "0%" : "-50%" }}
          transition={{ duration: 0.4 }}
        >
          {/* Page 1: Education Form */}
          <div className="w-1/2">
            <div className="flex flex-col gap-4 p-1">
              {["school", "degree", "field"].map((field) => (
                <div className="relative" key={field}>
                  <Input
                    name={field}
                    // @ts-expect-error: avoid
                    value={formData[field as keyof EducationType] || ""}
                    onChange={handleChange}
                    placeholder={
                      field === "school"
                        ? "School name"
                        : field === "degree"
                        ? "Degree (e.g. Bachelor of Science)"
                        : "Field of study (e.g. Computer Science)"
                    }
                  />
                  <div className="h-2 w-2 animate-ping rounded-full bg-rose-600 absolute -top-0.5 -left-0.5" />
                </div>
              ))}
              <DateRangeSelector
                onChange={({ startDate, endDate }) => {
                  setFormData((prev) => ({
                    ...prev,
                    start: startDate,
                    end: endDate,
                  }));
                }}
                value={{ startDate: formData.start!, endDate: formData.end }}
              />
            </div>
          </div>

          {/* Page 2: Markdown Editor & Preview */}
          <div className="w-1/2 flex flex-col gap-4 p-1 h-[75vh] scrollbar-auto">
            <div className="h-1/2 flex flex-col">
              <HtmlEditor
                defaultValue={formData.description || ""}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value || "" }))
                }
              />
            </div>

            <div className="border p-3 rounded-md bg-muted/40 overflow-auto h-1/2 prose prose-invert max-w-full scrollbar-auto">
              {error && (
                <p className="text-red-400 text-sm mb-2 italic">
                  Preview error: {error}
                </p>
              )}
              {CompiledComponent ? (
                <MDXProvider>
                  <CompiledComponent
                    components={getMDXComponents({ ...mdxComponents })}
                  />
                </MDXProvider>
              ) : !error ? (
                <p className="text-center text-muted-foreground">
                  No content to preview
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
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
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </div>
    </Keybindy>
  );
};

export default EduForm;
