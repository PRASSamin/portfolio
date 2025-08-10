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
} from "@/components/Timeline";
import { EducationType } from "@/types";
import { GraduationCap } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants } from "motion/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getMDXComponents, mdxComponents } from "@/mdx-components";

type Props = {
  educations: EducationType[];
};

const EducationSection = ({ educations }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [compiledContents, setCompiledContents] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const compileMDX = async () => {
      try {
        const results: Record<string, any> = {};

        // Process all educations to compile MDX
        await Promise.all(
          educations.map(async (edu) => {
            if (!edu.description) return;

            try {
              const { default: Content } = await evaluate(edu.description, {
                ...runtime,
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              });
              results[edu.id] = Content;
            } catch (error) {
              console.error(
                `Failed to compile MDX for education ${edu.id}:`,
                error
              );
              results[edu.id] = null;
            }
          })
        );

        setCompiledContents(results);
      } catch (error) {
        console.error("Error during MDX compilation:", error);
      }
    };

    if (educations?.length > 0) {
      compileMDX();
    }
  }, [educations]);

  // Animation variants for the timeline items
  const itemVariants: Variants = {
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
      data-section="education"
      className="flex flex-col gap-12 w-[calc(100vw-2rem)] lg:container mx-auto mt-24 xl:mt-28"
    >
      <div className="flex flex-col gap-1 items-left">
        <h3
          data-type="title"
          className="text-left text-4xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-linear-to-b from-theme-primary to-theme-secondary"
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
        maxWidth={"max-w-full md:max-w-[500px] min-w-full sm:min-w-[500px]"}
        position="right"
        variant="outline"
        align="start"
      >
        {educations.map((edu: EducationType, index: number) => {
          const MDX = compiledContents[edu.id];
          return (
            <motion.div
              key={edu.id}
              custom={index}
              variants={itemVariants}
              className="relative"
            >
              <TimelineItem>
                <TimelineIcon icon={<GraduationCap />} />
                <TimelineContent className="bg-popover/50 backdrop-blur-sm p-3.5">
                  <div className="flex flex-col gap-0.5">
                    <TimelineTitle
                      dangerouslySetInnerHTML={{ __html: edu.school }}
                    />
                    <TimelineRole
                      dangerouslySetInnerHTML={{
                        __html: `${edu.degree}, ${edu.field}`,
                      }}
                    />
                    <TimelinePeriod
                      dangerouslySetInnerHTML={{ __html: edu.period }}
                    />
                  </div>
                  {edu.description && MDX && (
                    <TimelineDescription as={"div"}>
                      <MDX components={getMDXComponents(mdxComponents)} />
                    </TimelineDescription>
                  )}
                </TimelineContent>
                <TimelineConnector />
              </TimelineItem>
            </motion.div>
          );
        })}
      </Timeline>
    </motion.div>
  );
};

export default EducationSection;
