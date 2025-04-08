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
} from "@/components/ui/timeline";
import { EducationType } from "@/types";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { FilePenLine } from "lucide-react";
import DeleteEdu from "./components/DeleteEdu";
import QuickActionsBar from "@/components/ui/quick-actions-bar";
import EditEducation from "./components/EditEdu";
import AddEducation from "./components/AddEdu";

const AdminEduView = ({ educations }: { educations: EducationType[] }) => {
  return (
    <div>
      <Timeline
        maxWidth={"max-w-full md:max-w-[500px]"}
        position="right"
        variant="outline"
        align="center"
      >
        {educations.map((edu: EducationType, index: number) => (
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
                {edu.description && (
                  <TimelineDescription
                    dangerouslySetInnerHTML={{
                      __html: edu?.description,
                    }}
                  />
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
        ))}
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
