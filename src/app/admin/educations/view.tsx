"use client";
import { Button } from "@/components/ui/button";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineIcon,
  TimelineItem,
  TimelinePeriod,
  TimelineRole,
  TimelineTitle,
} from "@/components/Timeline";
import { EducationType } from "@/types";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { FilePenLine } from "lucide-react";
import DeleteEdu from "./components/DeleteEducation";
import QuickActionsBar from "@/components/QuickActionsBar";
import EditEducation from "./components/EditEducation";
import AddEducation from "./components/AddEducation";
import { useEffect, useState } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { MDXContent } from "mdx/types";
import { getMDXComponents, mdxComponents } from "@/mdx-components";

const AdminEduView = ({ educations }: { educations: EducationType[] }) => {
  const [compiledContents, setCompiledContents] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const compileMDX = async () => {
      try {
        const results: Record<string, any> = {};

        // Process all educations to compile MDX
        await Promise.all(
          educations.map(async (edu) => {
            if (!edu.description) return;

            try {
              const { default: Content } = await evaluate(edu.description, {
                ...runtime,
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              });
              results[edu.id] = Content;
            } catch (error) {
              console.error(
                `Failed to compile MDX for education ${edu.id}:`,
                error
              );
              results[edu.id] = null;
            }
          })
        );

        setCompiledContents(results);
      } catch (error) {
        console.error("Error during MDX compilation:", error);
      }
    };

    if (educations?.length > 0) {
      compileMDX();
    }
  }, [educations]);

  return (
    <div>
      <Timeline
        maxWidth={"max-w-full md:max-w-[500px]  min-w-full sm:min-w-[500px]"}
        position="right"
        variant="outline"
        align="center"
      >
        {educations.map((edu: EducationType, index: number) => {
          const MDX: MDXContent = compiledContents[edu.id];
          return (
            <div key={edu.id} className="relative">
              <TimelineItem>
                <TimelineIcon
                  icon={<GraduationCap />}
                  className="z-50 bg-muted/50 border border-dashed border-muted-foreground/30"
                />
                <TimelineContent className="bg-muted/50 border border-dashed border-muted-foreground/30">
                  <div className="flex flex-col gap-0.5">
                    <TimelineTitle
                      dangerouslySetInnerHTML={{ __html: edu.school }}
                    />
                    <TimelineRole
                      dangerouslySetInnerHTML={{ __html: edu.degree }}
                    />
                    <TimelinePeriod
                      dangerouslySetInnerHTML={{ __html: edu.period }}
                    />
                  </div>
                  {edu.description && MDX && (
                    <TimelineDescription as={"div"}>
                      <MDX components={getMDXComponents(mdxComponents)} />
                    </TimelineDescription>
                  )}
                  <div className="flex justify-end gap-2">
                    <EditEducation education={edu}>
                      <Button
                        className="p-2 bg-green-500/30 hover:bg-green-500/50"
                        variant={"ghost"}
                      >
                        <FilePenLine />
                      </Button>
                    </EditEducation>
                    <div>
                      <DeleteEdu education={edu}>
                        <Button
                          className="p-2 bg-red-500/30 hover:bg-red-500/50"
                          variant={"ghost"}
                        >
                          <Trash2 />
                        </Button>
                      </DeleteEdu>
                    </div>
                  </div>
                </TimelineContent>
                <TimelineConnector className="z-0 bg-muted/50" />
              </TimelineItem>
            </div>
          );
        })}
      </Timeline>
      <QuickActionsBar
        verticalAlignment="bottom"
        horizontalAlignment="center"
        side="left"
        className="px-3.5 py-2 rounded-lg flex items-center gap-10"
        excludeWidth={{ md: 260, lg: 320, default: 80 }}
      >
        {/* Page Title */}
        <h1 className="text-lg font-semibold text-white select-none">
          Educations
        </h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <AddEducation>
            <Button
              variant="outline"
              size="icon"
              className="bg-muted-foreground/20 hover:bg-muted-foreground/30 text-white aspect-square p-0 border-0"
            >
              <Plus size={20} />
            </Button>
          </AddEducation>
        </div>
      </QuickActionsBar>
    </div>
  );
};

export default AdminEduView;
