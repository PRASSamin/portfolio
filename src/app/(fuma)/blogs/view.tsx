"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Link } from "@/components/Link";
import { motion, Variants } from "motion/react";
import { Check, Eye, ListFilterPlus, Loader2, SearchIcon } from "lucide-react";

import { BetterImage } from "@prass/betterimage/components";
import ExpandableText from "@/components/ExpandableText";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/utils";
import { formatDate } from "@/utils/format-date";
import { debounce } from "@/utils/debounce";
import Footer from "@/components/Footer";
import { Keybindy } from "@keybindy/react";
import { QueryBlogs } from "@/utils/get-blogs";
import Background from "@/components/Background";

const TAG_PREVIEW_LIMIT = 5;
const LIMIT = 20;

const BlogsView = ({
  initialBlogs,
  totalPages,
}: {
  initialBlogs: QueryBlogs["blogs"];
  totalPages: number;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<QueryBlogs["blogs"]>(initialBlogs);
  const [filteredBlogs, setFilteredBlogs] = useState<QueryBlogs["blogs"]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [total, setTotal] = useState(totalPages);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [sort, setSort] = useState("created_at-desc");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const debounced = debounce((q: string) => {
      setDebouncedSearch(q);
    }, 300);
    debounced(searchQuery);
    return () => {
      debounced.cancel();
    };
  }, [searchQuery]);

  const fetchBlogs = useCallback(async () => {
    setIsFetching(true);
    try {
      const [sortBy, order] = sort.split("-");
      const { data } = await axios.get(`${window.location.pathname}/api`, {
        params: { limit: LIMIT, page, search: debouncedSearch, sortBy, order },
      });

      setBlogs(data.blogs || initialBlogs);
      setTotal(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setIsFetching(false);
    }
  }, [page, debouncedSearch, sort]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    let result = blogs;

    if (selectedTag) {
      result = result.filter(
        (blog) => blog.tags && blog.tags.includes(selectedTag)
      );
    }

    setFilteredBlogs(result);
  }, [blogs, selectedTag]);

  const tags = useMemo(
    () => Array.from(new Set(blogs.flatMap((b) => b.tags || []))),
    [blogs]
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const searchVariants: Variants = {
    init: { width: 40, opacity: 0 },
    final: {
      width: "auto",
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const goToPage = (newPage: number) => {
    if (!total) return;
    if (newPage > 0 && newPage <= total) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setPage(newPage);
    }
  };

  return (
    <Keybindy
      shortcuts={[
        {
          keys: ["Ctrl", "K"],
          handler: () => {
            searchRef.current?.focus();
          },
          options: {
            preventDefault: true,
            data: {
              group: "On this page",
              description: "Search",
            },
          },
        },
        {
          keys: ["Esc"],
          handler: () => {
            searchRef.current?.blur();
          },
          options: {
            preventDefault: true,
            data: {
              group: "On this page",
              description: "Close search",
            },
          },
        },
      ]}
    >
      <Background />
      <motion.div
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={containerVariants}
        className="my-8 overflow-auto mt-24 min-h-[calc(100vh-45px-64px-(32px*2))] max-w-[calc(100vw-1rem)] lg:container mx-auto flex flex-col gap-8 items-center z-20"
      >
        <div ref={containerRef} className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-normal">
            My{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-theme-primary to-theme-secondary">
              Blogs
            </span>
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base lg:text-lg">
            Discover a collection of insightful articles and updates on various
            topics.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial="init"
            variants={searchVariants}
            animate={mounted ? "final" : "init"}
            className="relative"
          >
            <SearchIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground z-10" />
            <Input
              ref={searchRef}
              placeholder="Search..."
              className="w-[calc(100vw-5rem)] sm:w-[500px] border border-border/70 rounded-xl pl-11 py-6 bg-background/50 backdrop-blur-sm focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
            {!isSearchActive && (
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-muted-foreground text-xs font-mono">
                ⌘ + K
              </span>
            )}
          </motion.div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-[48px] rounded-lg p-0 aspect-square [&_svg]:size-5 "
              >
                <ListFilterPlus />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[...Array(4).keys()].map((i) => {
                      const order = {
                        Newest: "created_at-desc",
                        Oldest: "created_at-asc",
                        "Most Viewed": "views-desc",
                        "Least Viewed": "views-asc",
                      };
                      return (
                        <CommandItem
                          key={i}
                          value={Object.values(order)[i]}
                          onSelect={(currentValue) => {
                            setSort(currentValue === sort ? "" : currentValue);
                            setPage(1);
                          }}
                        >
                          {Object.keys(order)[i]}
                          {isFetching ? (
                            <Loader2
                              className={cn(
                                "ml-auto animate-spin",
                                sort === Object.values(order)[i]
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          ) : (
                            <Check
                              className={cn(
                                "ml-auto",
                                sort === Object.values(order)[i]
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-col gap-2 items-center w-full">
            <h2 className="text-sm text-start sm:text-center w-full">
              Choose a topic
            </h2>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-center w-full">
              <button
                className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-all outline-none ${
                  !selectedTag
                    ? "bg-theme-accent-1/30 text-theme-accent-1"
                    : "bg-muted/60 text-muted-foreground"
                }`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </button>
              {tags?.length > 0 &&
                tags
                  .slice(0, showAllTags ? tags.length : TAG_PREVIEW_LIMIT)
                  .map((tag) => (
                    <button
                      key={tag}
                      className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-all duration-300 ease-linear outline-none ${
                        selectedTag === tag
                          ? "bg-theme-accent-1/30 text-theme-accent-1"
                          : "bg-muted/60 text-muted-foreground"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
              {tags.length > TAG_PREVIEW_LIMIT && (
                <button
                  key="more"
                  className={`px-2.5 py-1 rounded-md text-sm font-semibold transition-all duration-300 ease-linear outline-none bg-muted/60 text-muted-foreground`}
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {(showAllTags ? "-" : "+") +
                    (tags.length - TAG_PREVIEW_LIMIT)}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Blog Cards */}
        {filteredBlogs.length === 0 ? (
          isFetching ? (
            <div className="text-muted-foreground text-lg text-center min-h-[40vh]">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="text-muted-foreground text-lg text-center mt-10 min-h-[40vh]">
              No blogs found
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
            {filteredBlogs.map((blog, i) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="w-full flex items-center justify-center gap-3 relative group"
              >
                <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-background/60 border border-dashed backdrop-blur-sm rounded-xl"></div>

                <Card className="h-full w-full flex flex-col bg-background/60 backdrop-blur-sm justify-between border-dashed transition-all duration-300 overflow-hidden group-hover:[transform:perspective(1000px)_rotateX(-2deg)_rotateY(3deg)] group-hover:origin-top-left">
                  <CardHeader className="p-0 h-full">
                    <div
                      className="border border-dashed rounded-t-lg overflow-hidden h-36"
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3), rgba(0,0,0,0))",
                      }}
                    >
                      {blog.thumbnail && (
                        <BetterImage
                          src={blog.thumbnail}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                          alt={blog.title}
                        />
                      )}
                    </div>
                    <CardTitle className="px-4 pb-0 pt-2">
                      <h2 className="text-white text-xl truncate">
                        {blog.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        {i === 0 &&
                          new Date(blog.updatedAt || blog.createdAt) >
                            new Date(
                              new Date().getTime() - 3 * 24 * 60 * 60 * 1000
                            ) && (
                            <span className="bg-muted text-foreground border px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
                              New
                            </span>
                          )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(blog.createdAt, blog.updatedAt)}
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-md pt-3 px-4">
                      <ExpandableText
                        text={blog?.description || ""}
                        maxLength={200}
                        expandable={false}
                      />
                    </CardDescription>
                    <div className="absolute top-1 left-2 bg-background/50 rounded py-1 px-2 flex items-center gap-1.5 text-foreground/80">
                      <Eye size={16} />
                      <span className="text-sm">{blog.views || "0"}</span>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap gap-2 p-4 pt-3">
                    {blog?.tags &&
                      blog.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-theme-accent-1/20 border border-theme-accent-1 rounded-full text-xs text-theme-accent-1 font-semibold capitalize"
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

        {/* Pagination */}
        {total > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={page === 1}
                  onClick={() => goToPage(page - 1)}
                />
              </PaginationItem>

              {[...Array(total)].map((_, index) => {
                const pageNum = index + 1;
                const isActive = page === pageNum;
                if (
                  pageNum === 1 ||
                  pageNum === total ||
                  Math.abs(pageNum - page) <= 1
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={isActive}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <PaginationItem key={`ellipsis-${pageNum}`}>
                      <span className="px-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  disabled={page === total}
                  onClick={() => goToPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>
      <Footer />
    </Keybindy>
  );
};

export default BlogsView;
