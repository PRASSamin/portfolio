"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BetterImage } from "@prass/betterimage/components";
import ExpandableText from "../../../../components/ExpandableText";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/components/Link";
import { GitHub, SlowMotionVideo } from "@mui/icons-material";
import { motion, useInView, Variants } from "motion/react";
import { useRef } from "react";
import { QueryProjects } from "@/utils/get-projects";

const MotionCarouselItem = motion.create(CarouselItem);

type Props = {
  projects: QueryProjects["projects"];
};

const ProjectSection: React.FC<Props> = ({ projects }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation variants for the cards
  const cardVariants: Variants = {
    hidden: { x: "100vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  // Container variants to stagger the cards
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="flex flex-col gap-10 items-center mb-14"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-t from-[#353535] to-[#ffffff] leading-normal!">
          Projects
        </h2>
        <p className="text-muted-foreground text-sm md:text-base text-center">
          Here are some of the projects I have worked on.
        </p>
      </div>
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent>
          {projects.map((project, i) => (
            <MotionCarouselItem
              className="sm:basis-1/2 min-[900px]:basis-1/3 xl:basis-1/4"
              key={project.slug}
              variants={cardVariants}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="w-full flex items-center justify-center gap-3 relative group"
              >
                <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-background/60 border border-dashed transition-all duration-300 ease-linear backdrop-blur-sm rounded-xl"></div>
                <Card
                  className={`
            h-full w-full flex flex-col bg-background/60 backdrop-blur-sm 
            justify-between transition-all duration-300 overflow-hidden border-dashed 
            group-hover:[transform:perspective(1000px)_rotateX(-2deg)_rotateY(3deg)] 
            group-hover:origin-top-left
          `}
                >
                  <CardHeader className="p-4 h-full justify-between">
                    <CardTitle className="flex items-center gap-2 relative min-h-56">
                      {project.thumbnail && (
                        <BetterImage
                          className="rounded-md aspect-square object-cover"
                          width={250}
                          height={250}
                          src={project.thumbnail}
                          alt={project.title}
                        />
                      )}
                      <span
                        title="Category"
                        className="absolute top-2 right-2 bg-[#31004d]/50 text-white backdrop-blur-sm px-2 py-1 rounded text-sm"
                      >
                        {project.category}
                      </span>
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-lime-500/70 text-white backdrop-blur-sm px-2 py-1 rounded text-sm">
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
                    {project?.links?.github && (
                      <Button
                        asChild
                        className="w-full bg-theme-accent-1/20 hover:bg-theme-accent-1/30 bordertheme-accent-1"
                        variant={"outline"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          className="flex items-center"
                          target="_blank"
                          href={project.links.github}
                        >
                          <GitHub /> Github
                        </Link>
                      </Button>
                    )}
                    {project?.links?.live && (
                      <Button
                        asChild
                        className="w-full bg-theme-accent-2/20 hover:bg-theme-accent-2/30 bordertheme-accent-2"
                        variant={"outline"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          className="flex items-center"
                          target="_blank"
                          href={project.links.live}
                        >
                          <SlowMotionVideo /> Live
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            </MotionCarouselItem>
          ))}
          {projects.length > 4 && (
            <CarouselItem className="sm:basis-1/2 md:basis-1/3 xl:basis-1/4 m-auto">
              <Link className="hover:underline" href={"/projects"}>
                ALL PROJECTS
              </Link>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </motion.div>
  );
};

export default ProjectSection;
