"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BetterImage } from "@prass/betterimage/components";
import ExpandableText from "@/components/ExpandableText";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, Variants } from "motion/react";
import { Check, Eye, ListFilterPlus, Loader2, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFontIconByName } from "@/utils/get-font-icon";
import { SlowMotionVideo } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/icons";
import { Link } from "@/components/Link";
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
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { debounce } from "@/utils/debounce";
import { Keybindy } from "@keybindy/react";
import { QueryProjects } from "@/utils/get-projects";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

const LIMIT = 20;

const ProjectsView = ({
  totalPages,
  initialProjects,
}: {
  initialProjects: QueryProjects["projects"];
  totalPages: number;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] =
    useState<QueryProjects["projects"]>(initialProjects);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [total, setTotal] = useState(totalPages);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
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

  const fetchProjects = useCallback(async () => {
    setIsFetching(true);
    try {
      const [sortBy, order] = sort.split("-");
      const { data } = await axios.get(`${window.location.pathname}/api`, {
        params: { limit: LIMIT, page, search: debouncedSearch, sortBy, order },
      });

      setProjects(data.projects || []);
      setTotal(data.totalPages || totalPages);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setIsFetching(false);
    }
  }, [page, debouncedSearch, sort]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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
        ref={containerRef}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={containerVariants}
        className="my-8 overflow-auto mt-24 min-h-[calc(100vh-45px-64px-(32px*2))] max-w-[calc(100vw-1rem)] lg:container mx-auto flex flex-col gap-8 items-center z-20"
      >
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-normal">
            My{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-theme-primary to-theme-secondary">
              Project
            </span>
          </h1>
          <p className="text-muted-foreground text-center text-sm sm:text-base lg:text-lg">
            A collection of projects that I have worked on
          </p>
        </div>

        {/* Search Input */}
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
                className="h-[48px] rounded-xl p-0 aspect-square [&_svg]:size-5 "
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

        {projects.length <= 0 ? (
          isFetching ? (
            <div className="text-muted-foreground text-lg text-center min-h-[40vh]">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="text-muted-foreground text-lg text-center mt-10 min-h-[40vh]">
              No projects found
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {projects.map((project, i) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.slug}
                className="w-full flex items-center justify-center gap-3 relative group"
              >
                {/* Background Overlay */}
                <div className="absolute inset-0 w-full h-full bg-transparent group-hover:bg-background/60 border border-dashed transition-all duration-300 ease-linear backdrop-blur-sm rounded-xl"></div>

                <Card
                  className={`
          h-full w-full flex flex-col bg-background/60 backdrop-blur-sm 
          justify-between transition-all duration-300 overflow-hidden border-dashed 
          group-hover:[transform:perspective(1000px)_rotateX(-2deg)_rotateY(3deg)] 
          group-hover:origin-top-left
        `}
                >
                  <CardHeader className="p-4 h-full justify-between">
                    <CardTitle className="flex items-center gap-2 relative min-h-56 aspect-16/12">
                      {project.thumbnail && (
                        <BetterImage
                          className="rounded-md object-cover"
                          width={250}
                          height={250}
                          src={project.thumbnail}
                          alt={project.title}
                        />
                      )}

                      {/* Category & Views */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <span
                          title="Category"
                          className="bg-[var(--accent-2)/0.5] text-white backdrop-blur-sm px-2 py-1 rounded text-sm"
                        >
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute top-1 left-2 bg-background/50 rounded py-1 px-2 flex items-center gap-1.5 text-foreground/80">
                        <Eye size={16} />
                        <span className="text-sm">{project.views || "0"}</span>
                      </div>
                    </CardTitle>

                    <CardDescription className="text-md flex flex-col">
                      <div className="flex items-center gap-2 mt-2">
                        {i === 0 &&
                          new Date(project.updated_at || project.created_at) >
                            new Date(
                              new Date().getTime() - 3 * 24 * 60 * 60 * 1000 // 3 days
                            ) && (
                            <span className="bg-muted text-foreground border px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
                              New
                            </span>
                          )}
                        <h2 className="text-white">{project.title}</h2>
                      </div>
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
                    <div className="w-full flex flex-col">
                      <div className="flex gap-2 flex-wrap w-full rounded-sm pb-2">
                        {project.tools?.map((tool, index) => {
                          const icon = getFontIconByName(tool);
                          if (!icon) return null;
                          return (
                            <Tooltip key={index} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <div className="icons text-[20px] cursor-pointer select-none">
                                  {String.fromCharCode(icon.code)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: icon.name || "",
                                  }}
                                />
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 w-full rounded-sm pt-2 items-center justify-between">
                        <div className="flex gap-2">
                          {project?.link?.github && (
                            <Button
                              asChild
                              className="bg-[var(--accent-1)/0.5] hover:bg-[var(--accent-1)/0.7] border-theme-accent-1"
                              variant={"outline"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link
                                className="flex items-center"
                                target="_blank"
                                href={project.link.github}
                              >
                                <Github /> Github
                              </Link>
                            </Button>
                          )}
                          {project?.link?.live && (
                            <Button
                              asChild
                              className="bg-[var(--accent-2)/0.3] hover:bg-[var(--accent-2)/0.5] border-theme-accent-2"
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
                        </div>
                      </div>
                    </div>
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

ProjectsView.displayName = "ProjectsView";

export default ProjectsView;
