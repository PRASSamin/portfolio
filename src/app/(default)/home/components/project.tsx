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
import ExpandableText from "../../../../components/ReadMore";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { GitHub, SlowMotionVideo } from "@mui/icons-material";
import { ProjectType } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MotionCarouselItem = motion.create(CarouselItem);

type Props = {
  projects: ProjectType[];
};

const ProjectSection: React.FC<Props> = ({ projects }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation variants for the cards
  const cardVariants = {
    hidden: { x: "100vw", opacity: 0 }, // Start outside the right edge
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
  const containerVariants = {
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
        <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-t from-[#353535] to-[#ffffff] !leading-normal">
          Projects
        </h2>
        <p className="text-muted-foreground">
          Here are some of the projects I have worked on.
        </p>
      </div>
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent>
          {projects.slice(0, 4).map((project, i) => (
            <MotionCarouselItem
              className="sm:basis-1/2 min-[900px]:basis-1/3 xl:basis-1/4"
              key={project.id}
              variants={cardVariants}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="w-full flex items-center justify-center gap-3 relative group"
              >
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
                        className="rounded-md object-cover"
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
                          <GitHub /> Github
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
