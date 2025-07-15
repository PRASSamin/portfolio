import { Github } from "@/components/icons";
import ExpandableText from "@/components/ReadMore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectType } from "@/types";
import { cn } from "@/utils";
import { SlowMotionVideo } from "@mui/icons-material";
import { BetterImage } from "@prass/betterimage/components";
import { Eye } from "lucide-react";
import Link from "next/link";

const ProjectCardView = ({
  project,
  selected,
  setSelected,
}: {
  project: ProjectType;
  selected: Set<string | number>;
  setSelected: React.Dispatch<Set<string | number>>;
}) => {
  const onProjectClick = (id: string | number) => {
    // @ts-expect-error: types issue
    setSelected((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center gap-3 relative group project-card cursor-pointer"
      )}
      data-id={project.id}
      onClick={(e) => {
        if (e.ctrlKey) {
          onProjectClick(project.id);
        }
      }}
    >
      <Card
        className={cn(
          "h-full w-full flex flex-col bg-background/60 backdrop-blur justify-between transition-all duration-300 overflow-hidden border-dashed",
          selected.has(project.id) ? "bg-muted/40" : ""
        )}
      >
        <CardHeader className="p-4 h-full w-full justify-between">
          <CardTitle className="flex items-center gap-2 relative min-h-56">
            <BetterImage
              className="rounded-md"
              width={250}
              height={250}
              src={project.image}
              alt={project.title}
            />
            <div className="absolute top-2 right-2 bg-background/50 rounded py-1 px-2 flex items-center gap-1.5 text-muted-foreground">
              <Eye size={16} />
              <span className="text-sm ">{project.views}</span>
            </div>
          </CardTitle>
          <CardDescription className="text-md flex flex-col">
            <h2 className="text-white">{project.title}</h2>
            <ExpandableText
              text={project?.description || ""}
              maxLength={80}
              className="text-muted-foreground/50 text-sm"
              expandButtonText="More"
              collapseButtonText="Less"
            />
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-1 items-center justify-between p-4 pt-0">
          <div className="w-full flex flex-col">
            <div className="flex gap-2 flex-wrap w-full rounded-sm pb-2">
              {project.tools.map((tool, index) => (
                <div
                  key={index}
                  className="icons text-[20px] cursor-pointer select-none"
                >
                  {String.fromCharCode(tool)}
                </div>
              ))}
            </div>
            <div className="flex gap-2 w-full rounded-sm pt-2">
              {project?.link?.github && (
                <Button
                  asChild
                  className="w-full bg-pink-700/50 hover:bg-pink-700/70 border-pink-600"
                  variant={"outline"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    className="flex items-center"
                    target="_blank"
                    href={project.link.github}
                  >
                    <Github /> Github
                  </Link>
                </Button>
              )}
              {project?.link?.live && (
                <Button
                  asChild
                  className="w-full bg-purple-700/30 hover:bg-purple-700/50 border-purple-600"
                  variant={"outline"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    className="flex items-center"
                    target="_blank"
                    href={project.link.live}
                  >
                    <SlowMotionVideo /> Live
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectCardView;
