"use client";
import HeroSection from "./components/Hero";
import ServiceSection from "./components/Services";
import JourneySection from "./components/Journey";
import ProjectSection from "./components/Projects";
import { useRef } from "react";
import { useInView, motion, Variants } from "motion/react";
import { QueryProjects } from "@/utils/get-projects";

type Props = {
  totalProjects: string | number;
  projects: QueryProjects["projects"];
};

const HomeView: React.FC<Props> = ({ totalProjects, projects }) => {
  const heroAnimation = useSectionAnimation();
  const serviceAnimation = useSectionAnimation();
  const journeyAnimation = useSectionAnimation();
  const projectAnimation = useSectionAnimation();
  const bannerAnimation = useSectionAnimation();

  return (
    <div className="flex flex-col items-center w-[calc(100vw-2rem)] lg:container mx-auto">
      <motion.div
        ref={heroAnimation.ref}
        initial="hidden"
        animate={heroAnimation.isInView ? "visible" : "hidden"}
        variants={heroAnimation.variants}
      >
        <HeroSection />
      </motion.div>
      <div className="flex flex-col gap-28 w-full">
        <motion.div
          ref={serviceAnimation.ref}
          initial="hidden"
          animate={serviceAnimation.isInView ? "visible" : "hidden"}
          variants={serviceAnimation.variants}
        >
          <ServiceSection />
        </motion.div>
        <motion.div
          ref={journeyAnimation.ref}
          initial="hidden"
          animate={journeyAnimation.isInView ? "visible" : "hidden"}
          variants={journeyAnimation.variants}
        >
          <JourneySection totalProjects={totalProjects} />
        </motion.div>
        <motion.div
          ref={projectAnimation.ref}
          initial="hidden"
          animate={projectAnimation.isInView ? "visible" : "hidden"}
          variants={projectAnimation.variants}
        >
          {projects && projects.length > 0 && (
            <ProjectSection projects={projects} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeView;

export const useSectionAnimation = ({ once = true, amount = 0.3 } = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return { ref, isInView, variants };
};
