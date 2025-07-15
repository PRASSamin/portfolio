"use client";
import React, { useRef } from "react";
import { ProjectType } from "@/types";
import ExpandableText from "../../../../components/ReadMore";
import { BetterImage } from "@prass/betterimage/components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFontIcon } from "@/utils/getFontIcon";
import Link from "next/link";
import { Github } from "@/components/icons";
import { Eye, LinkIcon } from "lucide-react";
import { motion, useInView } from "motion/react";
import { formatDate } from "@/utils";

const ProjectView: React.FC<{
  project: ProjectType & { views: number };
  content: string;
}> = ({ project, content }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  if (!project || !project?.title) {
    return (
      <motion.div ref={contentRef} className="bg-background mx-auto">
        <style>
          {`
            footer {
              background: hsl(var(--background)) !important;
            }
          `}
        </style>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={childVariants}
          className="flex flex-col items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto h-[calc(100vh-64px-45px)]"
        >
          <p className="text-muted-foreground">Project not found</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <style>
        {`
          html {
            overflow: hidden;
          }
          * {
            scroll-margin-top: 64px;
          }
          main {
            margin-top: -64px;
            z-index: 1 !important;
            max-height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
          }
          ::-webkit-scrollbar,
          ::-webkit-scrollbar-track {
            display: block !important;
            width: 7px;
            background: hsl(var(--background));
          }
          ::-webkit-scrollbar-thumb {
            background-color: hsl(var(--muted));
            border-radius: 30px;
            cursor: pointer;
          }
          footer {
            background: hsl(var(--background)) !important;
          }
        `}
      </style>
      <div className="bg-background mx-auto min-h-[calc(100vh-44px)] relative pb-10">
        <div ref={contentRef} />
        {/* Static BetterImage (no animation) */}
        {project?.image && (
          <div className="relative w-full h-80">
            <BetterImage
              src={project?.image}
              width={1200}
              height={600}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/40" />
          </div>
        )}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`lg:flex items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto relative z-50 ${
            project?.image ? "-mt-28" : "mt-5"
          }`}
        >
          <div className="prose-invert prose !max-w-[100ch] w-full flex flex-col gap-6">
            {/* Project Header */}
            <div className="h-full flex flex-col justify-between border-none not-prose">
              <motion.h2
                variants={childVariants}
                className="text-white text-4xl truncate font-bold capitalize pb-1.5"
              >
                {project.title}
              </motion.h2>
              <motion.div variants={childVariants}>
                <ExpandableText
                  text={project.description || ""}
                  maxLength={"max"}
                  expandable={false}
                />
              </motion.div>
              <motion.div
                variants={childVariants}
                className="flex gap-5 mt-12 mb-4 justify-between flex-row-reverse"
              >
                <span className="text-sm text-muted-foreground font-mono">
                  {formatDate(project.created_at, project.updated_at)}
                </span>
                <div className="flex gap-5">
                  {project.link?.github && (
                    <Link
                      target="_blank"
                      href={project.link.github}
                      className="flex gap-1.5 items-center text-sm hover:underline text-muted-foreground hover:text-foreground "
                    >
                      <Github size={16} />
                      <span className="mt-0.5">View on GitHub</span>
                    </Link>
                  )}
                  {project.link?.live && (
                    <Link
                      target="_blank"
                      href={project.link.live}
                      className="flex gap-1.5 items-center text-sm hover:underline text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon size={16} />
                      <span className="mt-0.5">Live Link</span>
                    </Link>
                  )}
                </div>
              </motion.div>
              <motion.div
                variants={childVariants}
                className="flex flex-col gap-4"
              >
                <div className="h-[1px] bg-border w-full" />
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span className="flex gap-1.5 items-center text-[13px]">
                      <Eye className="text-muted-foreground/70" size={16} />
                      <span>
                        {project?.views || (
                          <span className="font-frozito">–––</span>
                        )}{" "}
                        views
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
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
                              __html: getFontIcon(tool.toString())?.name || "",
                            }}
                          />
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="h-[1px] bg-border w-full" />
              </motion.div>
            </div>

            {/* Project Content */}
            {content ? (
              <motion.div
                variants={childVariants}
                className="markdown"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <motion.div
                variants={childVariants}
                className="w-full h-full flex items-center justify-center"
              >
                <p className="text-muted-foreground">
                  No content available for this project
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default ProjectView;
