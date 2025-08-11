"use client";
import { cn } from "@/utils";
import { memo, useEffect, useRef, useState } from "react";
import {
  React as ReactIcon,
  Python,
  Bootstrap,
  Css,
  Django,
  Express,
  Firebase,
  Flask,
  Flutter,
  Git,
  Github,
  Go,
  Html,
  JavaScript,
  Jinja,
  MySQL,
  Next,
  Node,
  Postgres,
  Redis,
  Tailwind,
  Vite,
  Motion,
} from "@/components/icons";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, useInView } from "motion/react";

const ExpertiseSection = memo(() => {
  const technologyColors = {
    purple: "shadow-purple-500 group-hover:shadow-purple-500/50",
    blue: "shadow-blue-500 group-hover:shadow-blue-500/50",
    sky: "shadow-sky-500 group-hover:shadow-sky-500/50",
    yellow: "shadow-yellow-500 group-hover:shadow-yellow-500/50",
    gray: "shadow-gray-500 group-hover:shadow-gray-500/50",
    green: "shadow-green-500 group-hover:shadow-green-500/50",
    red: "shadow-red-500 group-hover:shadow-red-500/50",
    orange: "shadow-orange-500 group-hover:shadow-orange-500/50",
    white: "shadow-white group-hover:shadow-white/50",
    djGreen: "shadow-[#2BA977] group-hover:shadow-[#2BA977]/50",
    jinjaRose: "shadow-[#e60058] group-hover:shadow-[#e60058]/50",
    goSky: "shadow-[#6ad7e5] group-hover:shadow-[#6ad7e5]/50",
    postSky: "shadow-[#336791] group-hover:shadow-[#336791]/50",
    gitOrange: "shadow-[#EE513B] group-hover:shadow-[#EE513B]/50",
    fireYellow: "shadow-[#FCCA3F] group-hover:shadow-[#FCCA3F]/50",
    vitePurple: "shadow-[#BD34FE] group-hover:shadow-[#BD34FE]/50",
  };

  const technologyStack = [
    { name: "HTML", icon: Html, className: technologyColors.orange, size: 40 },
    { name: "CSS", icon: Css, className: technologyColors.blue },
    { name: "Bootstrap", icon: Bootstrap, className: technologyColors.purple },
    {
      name: "Tailwind",
      icon: Tailwind,
      className: technologyColors.sky,
      size: 40,
    },
    {
      name: "JavaScript",
      icon: JavaScript,
      className: technologyColors.yellow,
    },
    {
      name: "Express.js",
      icon: Express,
      className: technologyColors.gray,
      size: 40,
    },
    {
      name: "Vite",
      icon: Vite,
      className: technologyColors.vitePurple,
      message:
        "This expertise UI is inspired by <a style='text-decoration: underline; cursor: pointer' href='https://vite.dev/#frameworks-section' target='_blank'>vite.dev</a>",
    },
    {
      name: "Next.js",
      icon: Next,
      className: technologyColors.white,
      size: 45,
    },
    {
      name: "Node.js",
      icon: Node,
      className: technologyColors.green,
      size: 50,
    },
    { name: "React", icon: ReactIcon, className: technologyColors.blue },
    { name: "Django", icon: Django, className: technologyColors.djGreen },
    {
      name: "Python",
      icon: Python,
      className: technologyColors.blue,
      size: 42,
    },
    { name: "Flask", icon: Flask, className: technologyColors.gray, size: 42 },
    { name: "Jinja", icon: Jinja, className: technologyColors.jinjaRose },
    { name: "Flutter", icon: Flutter, className: technologyColors.sky },
    { name: "Go", icon: Go, className: technologyColors.goSky, size: 42 },
    { name: "Redis", icon: Redis, className: technologyColors.red },
    { name: "MySQL", icon: MySQL, className: technologyColors.blue },
    { name: "Postgres", icon: Postgres, className: technologyColors.postSky },
    { name: "Git", icon: Git, className: technologyColors.gitOrange, size: 40 },
    { name: "GitHub", icon: Github, className: technologyColors.white },
    {
      name: "Firebase",
      icon: Firebase,
      className: technologyColors.fireYellow,
      size: 40,
    },
    {
      name: "Motion",
      icon: Motion,
      className: technologyColors.yellow,
      size: 50,
    },
  ];

  const stackRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const isInStackView = useInView(stackRef, { once: true, amount: 0.2 });
  const isInMainView = useInView(mainRef, { once: true, amount: 0.2 });
  const totalTechnologies = technologyStack.length;

  const rowCapacityBreakpoints = {
    default: 3,
    sm: 3,
    md: 5,
    lg: 6,
    xl: 8,
  };

  const [columnsPerRow, setColumnsPerRow] = useState(0);
  const [rowTranslations, setRowTranslations] = useState<string[]>([]);
  const [itemsPerRow, setItemsPerRow] = useState(0);

  useEffect(() => {
    const handleWindowResize = () => {
      const adjustedWidth = window.innerWidth * 1.2;
      const calculatedColumns = Math.floor(
        adjustedWidth / (window.innerWidth > 640 ? 129 : 104)
      );
      console.log(calculatedColumns);
      setColumnsPerRow(calculatedColumns);

      const calculatedRowCapacity =
        window.innerWidth > 1200
          ? rowCapacityBreakpoints.xl
          : window.innerWidth > 1024
          ? rowCapacityBreakpoints.lg
          : window.innerWidth > 768
          ? rowCapacityBreakpoints.md
          : window.innerWidth > 640
          ? rowCapacityBreakpoints.sm
          : rowCapacityBreakpoints.default;

      setItemsPerRow(calculatedRowCapacity);
      const totalRows = Math.ceil(totalTechnologies / calculatedRowCapacity);
      const translations = Array.from({ length: totalRows }, () =>
        (Math.floor(Math.random() * (30 - 5 + 1)) + 5).toString()
      );
      setRowTranslations(translations);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [totalTechnologies]);

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.09 },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const mainContainerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const generateTechnologyRows = () => {
    const rows = [];
    for (let i = 0; i < totalTechnologies; i += itemsPerRow) {
      rows.push(technologyStack.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  return (
    <TooltipProvider>
      <motion.div
        ref={mainRef}
        initial="hidden"
        animate={isInMainView ? "visible" : "hidden"}
        variants={mainContainerVariants}
        data-section="expertise"
        className="flex flex-col gap-4 w-full mt-24 xl:mt-28"
      >
        <div className="flex flex-col gap-1 items-center">
          <h3
            data-type="title"
            className="text-center text-4xl lg:text-5xl font-semibold text-foreground"
          >
            My{" "}
            <span className="tracking-tight inline from-theme-primary to-theme-secondary bg-clip-text text-transparent bg-linear-to-b">
              Expertise
            </span>{" "}
            Area
          </h3>
          <p
            data-type="description"
            className="text-muted-foreground text-sm lg:text-base text-center"
          >
            Discover my core skills and expertise areas.
          </p>
        </div>

        <motion.div
          ref={stackRef}
          initial="hidden"
          animate={isInStackView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col gap-4 sm:gap-6 w-[120%] ml-[-10%]"
        >
          <div className="flex justify-center items-center gap-4 sm:gap-6">
            {[...Array(columnsPerRow)].map((_, index) => (
              <div
                key={index}
                className="relative flex justify-center items-center gap-2.5  w-[80px] sm:w-[105px] aspect-square bg-linear-to-b from-transparent to-background/50 backdrop-blur-sm z-10 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute bottom-0 left-0 w-full h-px bg-border" />
                <div className="absolute left-0 top-0 w-px h-full bg-linear-to-b from-transparent to-border" />
                <div className="absolute right-0 top-0 w-px h-full bg-linear-to-b from-transparent to-border" />
              </div>
            ))}
          </div>

          {rowTranslations.length > 0 && (
            <div className="flex flex-col gap-4 sm:gap-6">
              {generateTechnologyRows().map((rowItems, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    transform: `translateX(${rowIndex % 2 === 0 ? "+" : "-"}${
                      rowTranslations[rowIndex]
                    }px)`,
                  }}
                  className="flex flex-col justify-center items-center gap-4 sm:gap-6 transition-all duration-300"
                >
                  <div className="flex justify-center items-center gap-4 sm:gap-6">
                    {[
                      ...Array(
                        Math.ceil((columnsPerRow - rowItems.length) / 2)
                      ),
                    ].map((_, index) => (
                      <div
                        key={`left-${index}`}
                        className="flex justify-center items-center gap-2.5 w-[80px] sm:w-[105px] aspect-square bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl z-10 transition-all duration-300 border hover:scale-105"
                      />
                    ))}
                    {rowItems.map((technology, _) => (
                      <motion.div
                        key={technology.name}
                        variants={itemVariants}
                        className="relative group  w-[80px] sm:w-[105px] aspect-square transition-all duration-500 cursor-pointer"
                      >
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center items-center gap-2.5  w-[80px] sm:w-[105px] aspect-square rounded-xl shadow-lg hover:shadow-xl z-10 transition-all duration-300 border">
                              <technology.icon
                                size={technology?.size || 35}
                                className="text-foreground"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: technology?.message || technology.name,
                              }}
                            />
                            <TooltipArrow width={15} height={7} />
                          </TooltipContent>
                        </Tooltip>
                        <div
                          className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-transparent w-[80%] aspect-square rounded-xl shadow-[0_10px_10px_2px] group-hover:shadow-[0_10px_30px_2px] group-hover:w-full transition-all duration-2000 group-hover:duration-300 ease-in-out",
                            technology.className
                          )}
                        />
                      </motion.div>
                    ))}
                    {[
                      ...Array(
                        Math.ceil((columnsPerRow - rowItems.length) / 2)
                      ),
                    ].map((_, index) => (
                      <div
                        key={`right-${index}`}
                        className="flex justify-center items-center gap-2.5 w-[80px] sm:w-[105px] aspect-square bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl z-10 transition-all duration-300 border hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-4 sm:gap-6">
            {[...Array(columnsPerRow)].map((_, index) => (
              <div
                key={index}
                className="relative flex justify-center items-center gap-2.5  w-[80px] sm:w-[105px] aspect-square bg-linear-to-t from-transparent to-background/50 backdrop-blur-sm z-10 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-border" />
                <div className="absolute left-0 top-0 w-px h-full bg-linear-to-t from-transparent to-border" />
                <div className="absolute right-0 top-0 w-px h-full bg-linear-to-t from-transparent to-border" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
});

ExpertiseSection.displayName = "ExpertiseSection";

export default ExpertiseSection;
