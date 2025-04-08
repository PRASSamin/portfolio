"use client";
import { ProjectType } from "@/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BetterImage } from "@prass/betterimage/components";
import ExpandableText from "../../../components/ReadMore";
import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "motion/react";
import useShortcut from "@/hooks/useShortcut";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFontIcon } from "@/utils/getFontIcon";
import { SlowMotionVideo } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/icons";
import Link from "next/link";

interface Props {
  projects: ProjectType[];
}

const ProjectPageView: React.FC<Props> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] =
    useState<Array<ProjectType>>(projects);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  useShortcut(["alt", "s"], () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  });

  useEffect(() => {
    let allProjects = projects;

    if (searchQuery.trim() !== "") {
      allProjects = allProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSearchResult(allProjects);
  }, [searchQuery, projects]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const searchVariants = {
    init: { width: 40 },
    final: { width: "auto", transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <TooltipProvider>
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="my-8 min-h-[calc(100vh-45px-64px-(32px*2))] w-[calc(100vw-2rem)] lg:container mx-auto flex flex-col gap-10 items-center"
      >
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-4xl lg:text-6xl font-black leading-normal">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#9809eb] to-[#ff5277]">
              Project
            </span>
          </h1>
          <p className="text-muted-foreground text-center text-base lg:text-lg">
            A collection of projects that I have worked on
          </p>
        </div>

        {/* Search Input */}
        {searchResult.length >= 0 && (
          <motion.div
            initial="init"
            variants={searchVariants}
            animate={isInView ? "final" : "init"}
            className="relative overflow-hidden"
          >
            <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              type="text"
              ref={searchRef}
              placeholder="Search..."
              className="w-[calc(100vw-2rem)] sm:w-[500px] border border-border/70 rounded-xl pl-11 py-6 outline-none ring-0 bg-background/50 backdrop-blur focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
            {!isSearchActive && (
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground z-10 text-xs font-medium font-mono mt-0.5">
                ALT + S
              </span>
            )}
          </motion.div>
        )}

        {searchResult.length <= 0 ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {searchResult.map((project, i) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="w-full flex items-center justify-center gap-3 relative group"
              >
                {/* Background Overlay */}
                <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-background/60 border border-dashed transition-all duration-300 ease-linear backdrop-blur rounded-xl"></div>
                <Card
                  className={`
            h-full w-full flex flex-col bg-background/60 backdrop-blur 
            justify-between transition-all duration-300 overflow-hidden border-dashed 
            group-hover:[transform:perspective(1000px)_rotateX(-2deg)_rotateY(3deg)] 
            group-hover:[transform-origin:top_left]
          `}
                >
                  <CardHeader className="p-4 h-full justify-between">
                    <CardTitle className="flex items-center gap-2 relative min-h-56">
                      <BetterImage
                        className="rounded-md"
                        width={250}
                        height={250}
                        src={project.image}
                        alt={project.title}
                      />
                      <span
                        title="Category"
                        className="absolute top-2 right-2 bg-[#31004d]/50 text-white backdrop-blur px-2 py-1 rounded text-sm"
                      >
                        {project.category}
                      </span>
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-lime-500/70 text-white backdrop-blur px-2 py-1 rounded text-sm">
                          New
                        </span>
                      )}
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
                          <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div className="icons text-[20px] cursor-pointer select-none">
                                {String.fromCharCode(tool)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html:
                                    getFontIcon(tool.toString())?.name || "",
                                }}
                              />
                            </TooltipContent>
                          </Tooltip>
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
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
};

ProjectPageView.displayName = "ProjectPageView";

export default ProjectPageView;
