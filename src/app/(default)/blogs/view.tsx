"use client";
import ExpandableText from "@/components/ReadMore";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BlogType } from "@/types";
import { formatDate } from "@/utils";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import useShortcut from "@/hooks/useShortcut";
import { BetterImage } from "@prass/betterimage/components";
import { motion, useInView } from "motion/react";

const BlogsView: React.FC<{ allBlogs: Array<BlogType> }> = ({ allBlogs }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState(allBlogs);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useShortcut(["alt", "s"], () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  });

  useEffect(() => {
    let blogs = allBlogs;

    if (searchQuery.trim() !== "") {
      blogs = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      blogs = blogs.filter((blog) => blog.tags.includes(selectedTag));
    }

    setFilteredBlogs(blogs);
  }, [searchQuery, selectedTag, allBlogs]);

  // Extract unique tags for filtering
  const tags = Array.from(new Set(allBlogs.flatMap((blog) => blog.tags)));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const searchVariants = {
    init: { width: 40 },
    final: { width: "auto", transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="my-8 min-h-[calc(100vh-45px-64px-(32px*2))] w-[calc(100vw-2rem)] lg:container mx-auto flex flex-col gap-8 items-center"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl lg:text-6xl font-black leading-normal">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffa5c3] to-[#eb0954]">
            Blogs
          </span>
        </h1>
        <p className="text-muted-foreground text-center text-base lg:text-lg">
          Discover a collection of insightful articles and updates on various
          topics.
        </p>
      </div>

      {/* Search Input */}
      <motion.div
        initial="init"
        variants={searchVariants}
        animate={isInView ? "final" : "init"}
        className="relative overflow-hidden"
      >
        <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          type="text"
          ref={searchRef}
          placeholder="Search..."
          className="w-[calc(100vw-2rem)] sm:w-[500px] border border-border/70 rounded-xl pl-11 py-6 outline-none ring-0 bg-background/50 backdrop-blur focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
        />
        {!isSearchActive && (
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground z-10 text-xs font-medium font-mono mt-0.5">
            ALT + S
          </span>
        )}
      </motion.div>

      {/* Tag Filter */}
      <div className="flex flex-col gap-2 items-center w-full">
        <h2 className="text-sm text-start sm:text-center w-full">
          Choose a topic
        </h2>
        <div className="flex flex-wrap gap-2 justify-start sm:justify-center w-full">
          <button
            className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-all ${
              !selectedTag
                ? "bg-rose-700/30 text-rose-500"
                : "bg-muted/60 text-muted-foreground"
            }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-all duration-300 ease-linear ${
                selectedTag === tag
                  ? "bg-rose-700/30 text-rose-500"
                  : "bg-muted/60 text-muted-foreground"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-muted-foreground text-lg text-center mt-10">
          No blogs found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
          {filteredBlogs.map((blog, i) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="w-full flex items-center justify-center gap-3 relative group"
            >
              {/* Background Overlay */}
              <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-background/60 border border-dashed transition-all duration-300 ease-linear backdrop-blur rounded-xl"></div>

              {/* Blog Card */}
              <Card
                className={`
          h-full w-full flex flex-col bg-background/60 backdrop-blur 
          justify-between transition-all duration-300 overflow-hidden border-dashed 
          group-hover:[transform:perspective(1000px)_rotateX(-2deg)_rotateY(3deg)] 
          group-hover:[transform-origin:top_left]
        `}
              >
                <CardHeader className="p-0 h-full">
                  {blog?.thumbnail && (
                    <div
                      className="border border-dashed rounded-t-lg overflow-hidden h-36"
                      style={{
                        maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))`,
                      }}
                    >
                      <BetterImage
                        src={blog.thumbnail}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                        alt={blog.title}
                      />
                    </div>
                  )}
                  <CardTitle className="flex flex-col gap-2 relative px-4 pb-0">
                    <h2 className="text-white text-xl truncate">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-1">
                      {i === 0 &&
                        ((blog.created_at &&
                          new Date(blog.created_at) >
                            new Date(
                              new Date().getTime() - 5 * 24 * 60 * 60 * 1000
                            )) ||
                          (blog.updated_at &&
                            new Date(blog.updated_at) >
                              new Date(
                                new Date().getTime() - 5 * 24 * 60 * 60 * 1000
                              ))) && (
                          <span className="bg-background text-muted-foreground border-muted border backdrop-blur px-1.5 py-1 rounded-[2px] text-xs">
                            New
                          </span>
                        )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(blog.created_at, blog.updated_at)}
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-md pt-3 flex flex-col px-4">
                    <ExpandableText
                      text={blog.description}
                      maxLength={200}
                      expandable={false}
                    />
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-2 items-center p-4 pt-3">
                  {blog.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-rose-800/50 border border-rose-700 rounded-full text-xs text-rose-500 font-semibold capitalize select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BlogsView;
