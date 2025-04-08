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
import { EducationType } from "@/types";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import { GraduationCap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

type Props = {
  educations: EducationType[];
};

const EducationSection = ({ educations }: Props) => {
  const [educationsData, setEducationsData] = useState<EducationType[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const processExperiences = async () => {
      const processed = await Promise.all(
        educations.map(async (exp) => ({
          ...exp,
          description: await prepareMarkdown(exp?.description || ""),
          degree: await prepareMarkdown(exp?.degree),
          school: await prepareMarkdown(exp?.school),
          period: await prepareMarkdown(exp?.period),
        }))
      );
      setEducationsData(processed);
    };

    processExperiences();
  }, [educations]);

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
      data-section="education"
      className="flex flex-col gap-12 w-[calc(100vw-2rem)] lg:container mx-auto mt-5"
    >
      <div className="flex flex-col gap-1 items-left">
        <h3
          data-type="title"
          className="text-left text-4xl lg:text-6xl font-semibold text-foreground"
        >
          Education
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-left max-w-full md:max-w-[50%]"
        >
          A glimpse into my professional journey, highlighting key achievements
          and impactful experiences.
        </p>
      </div>
      <Timeline
        maxWidth={"max-w-full md:max-w-[500px]"}
        position="right"
        variant="outline"
        align="start"
      >
        {educationsData.map((edu: EducationType, index: number) => (
          <motion.div
            key={edu.id}
            custom={index}
            variants={itemVariants}
            className="relative"
          >
            <TimelineItem>
              <TimelineIcon icon={<GraduationCap />} />
              <TimelineContent>
                <div className="flex flex-col gap-0.5">
                  <TimelineTitle
                    dangerouslySetInnerHTML={{ __html: edu.school }}
                  />
                  <TimelineRole
                    dangerouslySetInnerHTML={{ __html: edu.degree }}
                  />
                  <TimelinePeriod
                    dangerouslySetInnerHTML={{ __html: edu.period }}
                  />
                </div>
                {edu.description && (
                  <TimelineDescription
                    dangerouslySetInnerHTML={{ __html: edu.description }}
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

export default EducationSection;
