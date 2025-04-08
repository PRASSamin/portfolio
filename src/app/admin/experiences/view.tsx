"use client";
import QuickActionsBar from "@/components/ui/quick-actions-bar";
import {
  Timeline,
  TimelineDescription,
  TimelinePeriod,
  TimelineRole,
  TimelineTitle,
  TimelineContent,
  TimelineIcon,
  TimelineItem,
  TimelineConnector,
} from "@/components/ui/timeline";
import { ExperienceType } from "@/types";
import { Briefcase, FilePenLine, Plus, Trash2 } from "lucide-react";
import DeleteExperience from "./components/DeleteExp";
import { Button } from "@/components/ui/button";
import AddExperience from "./components/AddExp";
import EditExperience from "./components/EditExp";
// import DeleteEdu from "./components/DeleteEdu";
// import QuickActionsBar from "@/components/ui/quick-actions-bar";
// import EditEducation from "./components/EditEdu";
// import AddEducation from "./components/AddEdu";

const AdminExpView = ({ experiences }: { experiences: ExperienceType[] }) => {
  return (
    <div>
      <Timeline
        maxWidth={"max-w-full md:max-w-[500px]"}
        position="right"
        variant="outline"
        align="center"
      >
        {experiences.map((exp, index: number) => (
          <div key={exp.id} className="relative">
            <TimelineItem>
              <TimelineIcon
                icon={<Briefcase />}
                className="z-50 bg-muted/50 border border-dashed border-muted-foreground/30"
              />
              <TimelineContent className="bg-muted/50 border border-dashed border-muted-foreground/30">
                <div className="flex flex-col gap-0.5">
                  <TimelineTitle
                    dangerouslySetInnerHTML={{ __html: exp.company }}
                  />
                  <TimelineRole
                    dangerouslySetInnerHTML={{ __html: exp.role }}
                  />
                  <TimelinePeriod
                    dangerouslySetInnerHTML={{ __html: exp.period }}
                  />
                </div>
                {exp.description && (
                  <TimelineDescription
                    dangerouslySetInnerHTML={{
                      __html: exp.description,
                    }}
                  />
                )}
                <div className="flex justify-end gap-2">
                  <EditExperience experience={exp}>
                    <Button
                      className="p-2 bg-green-500/30 hover:bg-green-500/50"
                      variant={"ghost"}
                    >
                      <FilePenLine />
                    </Button>
                  </EditExperience>
                  <div>
                    <DeleteExperience experience={exp}>
                      <Button
                        className="p-2 bg-red-500/30 hover:bg-red-500/50"
                        variant={"ghost"}
                      >
                        <Trash2 />
                      </Button>
                    </DeleteExperience>
                  </div>
                </div>
              </TimelineContent>
              <TimelineConnector className="z-0 bg-muted/5" />
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
        <h1 className="text-lg font-semibold text-white select-none">
          Educations
        </h1>

        <div className="flex items-center gap-1">
          <AddExperience>
            <Button
              variant="outline"
              size="icon"
              className="bg-muted-foreground/20 hover:bg-muted-foreground/30 text-white aspect-square p-0 border-0"
            >
              <Plus size={20} />
            </Button>
          </AddExperience>
        </div>
      </QuickActionsBar>
    </div>
  );
};

export default AdminExpView;
