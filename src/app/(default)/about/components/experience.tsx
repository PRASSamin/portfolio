"use client";
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineContent,
  TimelineTitle,
  TimelinePeriod,
  TimelineRole,
  TimelineDescription,
  TimelineConnector,
} from "@/components/ui/timeline";
import { BriefcaseBusinessIcon as Briefcase } from "lucide-react";
import { ExperienceType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import { motion, useInView } from "framer-motion";

type Props = {
  experiences: ExperienceType[];
};

const ExperienceSection = ({ experiences }: Props) => {
  const [experiencesData, setExperiencesData] = useState<ExperienceType[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const processExperiences = async () => {
      const processed = await Promise.all(
        experiences.map(async (exp) => ({
          ...exp,
          description: await prepareMarkdown(exp?.description || ""),
          company: await prepareMarkdown(exp?.company),
          role: await prepareMarkdown(exp?.role),
          period: await prepareMarkdown(exp?.period),
        }))
      );
      setExperiencesData(processed);
    };

    processExperiences();
  }, [experiences]);

  // Animation variants for the timeline items
  const itemVariants = {
    hidden: (index: number) => ({
      y: -index * 100,
      opacity: 0.5,
      scale: 0.95,
    }),
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  // Container variants for staggering children
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
      data-section="experience"
      className="flex flex-col gap-12 mt-24 xl:mt-28 w-[calc(100vw-2rem)] lg:container mx-auto"
    >
      <div className="flex flex-col gap-1 items-left">
        <h3
          data-type="title"
          className="text-left text-4xl lg:text-6xl font-semibold text-foreground"
        >
          Experience
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-left max-w-full md:max-w-[50%]"
        >
          A brief overview of my academic milestones and achievements that
          define my expertise.
        </p>
      </div>
      <Timeline
        maxWidth={"max-w-full md:max-w-[500px]"}
        position="right"
        variant="outline"
        align="start"
      >
        {experiencesData.map((exp: ExperienceType, index: number) => (
          <motion.div
            key={exp.id}
            custom={index}
            variants={itemVariants}
            className="relative"
          >
            <TimelineItem key={exp.id}>
              <TimelineIcon icon={<Briefcase />} />
              <TimelineContent>
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
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                )}
              </TimelineContent>
              <TimelineConnector />
            </TimelineItem>
          </motion.div>
        ))}
      </Timeline>
    </motion.div>
  );
};

export default ExperienceSection;
