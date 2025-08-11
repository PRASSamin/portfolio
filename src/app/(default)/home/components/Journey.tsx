"use client";
import { motion, useInView, Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  totalProjects: string | number;
};

const JourneySection = ({ totalProjects }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [animatePlus, setAnimatePlus] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    // Calculate targets 
    const targetYears = new Date().getFullYear() - 2022;
    const targetProjects = Number(totalProjects);

    // Function to animate counting up
    const animateCount = (
      setter: (value: number) => void,
      target: number,
      duration: number,
      onComplete?: () => void
    ) => {
      const steps = Math.min(target, 100);
      const increment = target / steps;
      const interval = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
          if (onComplete) setTimeout(onComplete, 200);
        } else {
          setter(Math.round(current));
        }
      }, interval);

      return () => clearInterval(timer);
    };

    // Start animations
    animateCount(setYears, targetYears, 1000);
    animateCount(setProjects, targetProjects, 1000, () => setAnimatePlus(true));
  }, [isInView]);

  // Animation variants
  const plusVariants: Variants = {
    hidden: { x: -30, y: -50, opacity: 0, width: 0 },
    drop: {
      y: 0,
      x: -30,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    kick: { y: 0, opacity: 1, x: -30, transition: { duration: 0.2 } },
  };

  const numberVariants: Variants = {
    initial: { x: 0 },
    kicked: { x: -100, transition: { duration: 0.2, ease: "easeIn" } },
    bounceBack: {
      x: -35,
      transition: { type: "spring", stiffness: 180, damping: 12 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 items-center"
    >
      <h2 className="md:text-lg text-sm text-muted-foreground">My Journey So Far</h2>
      <div className="flex gap-3 w-full items-center justify-evenly">
        {/* Years Counter */}
        <div className="items-center gap-3 hidden md:flex">
          <span className="text-4xl md:text-6xl font-bold">{years}</span>
          <span className="text-sm md:text-base flex flex-col text-muted-foreground font-medium">
            YEARS OF <span>EXPERIENCE</span>
          </span>
        </div>

        {/* Projects Counter */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            {/* Number Animation */}
            <motion.span
              className="text-5xl lg:text-6xl font-bold"
              variants={numberVariants}
              initial="initial"
              animate={animatePlus ? ["kicked", "bounceBack"] : "initial"}
              transition={{
                // @ts-expect-error: ignore
                kicked: { duration: 0.2 },
                bounceBack: {
                  delay: 0.2,
                  type: "spring",
                  stiffness: 180,
                  damping: 12,
                },
              }}
            >
              {projects}
            </motion.span>

            {/* + Sign Animation */}
            <motion.span
              className="text-5xl md:text-6xl font-bold absolute left-full"
              variants={plusVariants}
              initial="hidden"
              animate={animatePlus ? ["drop", "kick"] : "hidden"}
              // @ts-expect-error: ignore
              transition={{ drop: { duration: 0.3, ease: "easeOut" } }}
            >
              +
            </motion.span>
          </div>
          <span className="text-sm md:text-base flex flex-col text-muted-foreground font-medium">
            PROJECTS
            <span>COMPLETED</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default JourneySection;
