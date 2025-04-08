"use client";
import ExpandableText from "@/components/ReadMore";
import { BlogType } from "@/types";
import { formatDate } from "@/utils";
import { BetterImage } from "@prass/betterimage/components";
import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

const BlogPageView: React.FC<{ blog: BlogType; content: string }> = ({
  blog,
  content,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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

  if (!blog) {
    return (
      <div ref={ref} className="bg-background mx-auto">
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
          className="flex flex-col items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto h-[calc(100vh-64px-44px)]"
        >
          <p className="text-muted-foreground">Blog not found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
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
      <div
        className={`bg-background mx-auto min-h-[calc(100vh-44px)] pb-14 relative`}
      >
        <div ref={ref} />
        {blog?.thumbnail && (
          <div className="relative w-full h-80">
            <BetterImage
              src={blog?.thumbnail}
              width={1200}
              height={600}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/80" />
          </div>
        )}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`lg:flex items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto relative z-50 ${
            blog?.thumbnail ? "-mt-28" : "mt-5"
          }`}
        >
          <div className="prose-invert prose !max-w-[100ch] flex flex-col gap-6">
            {/* Blog Header */}
            <div className="h-full flex flex-col justify-between border-none not-prose">
              <motion.h2
                variants={childVariants}
                className="text-white text-4xl truncate font-bold capitalize pb-1.5"
              >
                {blog.title}
              </motion.h2>
              <motion.div variants={childVariants}>
                <ExpandableText
                  text={blog.description}
                  maxLength={"max"}
                  expandable={false}
                />
              </motion.div>
              <motion.div
                variants={childVariants}
                className="flex flex-col gap-4 mt-16"
              >
                {/* Line */}
                <div className="h-[1px] bg-border w-full" />
                {/* Blog Meta */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatDate(blog.created_at, blog.updated_at)}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {blog.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-rose-800/50 border border-rose-700 rounded-full text-[13px] text-rose-500 font-semibold select-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Line */}
                <div className="h-[1px] bg-border w-full" />
              </motion.div>
            </div>

            {/* Blog Content */}
            <motion.div
              variants={childVariants}
              className="markdown"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <motion.div
              variants={childVariants}
              className="prose-invert prose flex flex-col"
            >
              <h2
                id="topics"
                className="border-l-[5px] border-rose-600 pl-2.5 hover:underline"
              >
                <a className="no-underline" href="#topics">
                  Topics
                </a>
              </h2>
              <div className="flex gap-2 items-center no-scrollbar">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-rose-800/50 border border-rose-700 rounded-full text-[13px] text-rose-500 font-semibold select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default BlogPageView;
