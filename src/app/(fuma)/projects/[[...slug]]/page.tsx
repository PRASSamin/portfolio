import { db } from "@/utils/db";
import { metatag } from "@/utils/metatag";
import { headers } from "next/headers";
import { source, projectSource } from "@/utils/source";
import { notFound } from "next/navigation";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { getMDXComponents, mdxComponents } from "@/mdx-components";
import { formatDate } from "@/utils/format-date";
import { motion, useInView } from "motion/react";
import { BetterImage } from "@prass/betterimage/components";
import ExpandableText from "@/components/ExpandableText";
import { Eye, LinkIcon } from "lucide-react";
import { isTomorrow } from "date-fns";
import { Heading } from "fumadocs-ui/components/heading";
import { geolocation, ipAddress } from "@vercel/functions";
import { NextRequest } from "next/server";
import Footer from "@/components/Footer";
import { getBlogs } from "@/utils/get-blogs";
import { getProjects } from "@/utils/get-projects";
import Link from "next/link";
import { Github } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFontIconByName } from "@/utils/get-font-icon";
import ProjectsView from "../view";

type Props = Promise<{ slug?: string[] }>;

const ProjectPage = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const page = projectSource.getPage(slug);
  if (!slug) {
    const projectsData = await getProjects({ page: 1, limit: 20 });
    return (
      <ProjectsView
        initialProjects={projectsData.projects}
        totalPages={projectsData.totalPages}
      />
    );
  }
  if (!page) notFound();
  const Headers = await headers();
  const ip =
    Headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    Headers.get("x-real-ip") ||
    "unknown";
  const { country, flag } = geolocation({ headers: Headers } as NextRequest);

  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

  const fSlug = page.slugs.join("/");

  const tracker = await db.projectViewTracker.findUnique({
    where: {
      slug_visitorId: {
        slug: fSlug,
        visitorId: ip,
      },
    },
  });

  // New visitor or first view for this blog
  if (!tracker) {
    await db.$transaction([
      db.projectStat.upsert({
        where: { slug: fSlug },
        create: { slug: fSlug, totalViews: 1 },
        update: { totalViews: { increment: 1 } },
      }),

      db.projectViewTracker.create({
        data: {
          slug: fSlug,
          visitorId: ip,
          count: 1,
          country: `${country} ${flag}`,
          lastSeen: new Date(),
        },
      }),
    ]);
  }
  // Existing visitor
  else if (tracker.lastSeen < threeMinutesAgo) {
    await db.$transaction([
      db.projectViewTracker.update({
        where: {
          slug_visitorId: {
            slug: fSlug,
            visitorId: ip,
          },
        },
        data: {
          lastSeen: new Date(),
          count: { increment: 1 },
        },
      }),

      db.projectStat.update({
        where: { slug: fSlug },
        data: { totalViews: { increment: 1 } },
      }),
    ]);
  }

  // total views
  const projectStat = await db.projectStat.findUnique({
    where: { slug: fSlug },
    select: { totalViews: true },
  });

  page.data.views = projectStat?.totalViews;
  const MDX = page.data.body;

  return (
    <>
      <div className={`bg-background min-h-[calc(100vh-44px)] pb-4 relative`}>
        <div />
        {page.data.thumbnail ? (
          <div className="relative w-full h-80">
            <BetterImage
              src={page.data.thumbnail}
              width={1200}
              height={600}
              priority
              alt={page.data.title}
              className="w-screen h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
            <div className="absolute right-3 top-[72px] md:hidden">
              <span className="flex gap-1.5 items-center text-[13px] select-none">
                <Eye className="text-muted-foreground/70" size={16} />
                <span>{page.data.views}</span>
              </span>
            </div>
          </div>
        ) : null}
        <div
          className={`lg:flex items-center justify-center max-w-[calc(100vw-1rem)] lg:max-w-full mx-auto relative z-50 ${
            page?.data?.thumbnail ? "-mt-28" : "mt-40"
          }`}
        >
          <div className="prose prose-invert !max-w-[100ch] w-full flex flex-col gap-6">
            {/* page.data Header */}
            <div className="h-full flex flex-col justify-between border-none not-prose">
              <h2 className="text-white text-3xl sm:text-4xl font-bold capitalize pb-1.5">
                {page.data.title}
              </h2>
              <div>
                <ExpandableText
                  text={page.data.description || ""}
                  maxLength={"max"}
                  className="text-sm md:text-base text-muted-foreground"
                  expandable={false}
                />
              </div>
              <div className="flex gap-5 mt-12 mb-4 justify-between flex-row-reverse">
                <span className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {formatDate(page.data.createdAt, page.data.updatedAt)}
                </span>
                <div className="flex gap-5">
                  {page.data.links?.github && (
                    <Link
                      target="_blank"
                      href={page.data.links.github}
                      className="flex gap-1.5 items-center text-xs sm:text-sm hover:underline text-muted-foreground hover:text-foreground "
                    >
                      <Github className="size-3 sm:size-4" />
                      <span className="mt-0.5">
                        <span className="hidden sm:inline">View on GitHub</span>
                        <span className="sm:hidden">GitHub</span>
                      </span>
                    </Link>
                  )}
                  {page.data.links?.live && (
                    <Link
                      target="_blank"
                      href={page.data.links.live}
                      className="flex gap-1.5 items-center text-xs sm:text-sm hover:underline text-muted-foreground hover:text-foreground"
                    >
                      <LinkIcon className="size-3 sm:size-4" />
                      <span className="mt-0.5">Live</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-px bg-border w-full" />
                <div className="flex justify-center md:justify-between">
                  <div className="hidden md:flex items-center gap-1">
                    <span className="flex gap-1.5 items-center text-[13px]">
                      <Eye className="text-muted-foreground/70" size={16} />
                      <span>
                        {page.data.views || (
                          <span className="font-frozito">–––</span>
                        )}{" "}
                        views
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    {page.data.tools?.map((tool, index) => {
                      const icon = getFontIconByName(tool);
                      if (!icon) return null;
                      return (
                        <Tooltip key={index} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="icons text-[14px] sm:text-[20px] cursor-pointer select-none">
                              {String.fromCharCode(icon.code)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: icon.name || "",
                              }}
                            />
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                <div className="h-px bg-border w-full" />
              </div>
            </div>

            <DocsPage
              footer={{ enabled: false }}
              container={{ className: "!pt-0" }}
              article={{ className: "!px-0" }}
            >
              <DocsBody className="prose prose-invert !max-w-[100ch] !px-0">
                <MDX components={getMDXComponents(mdxComponents)} />
              </DocsBody>
            </DocsPage>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectPage;

export async function generateStaticParams() {
  return source.generateParams();
}
export async function generateMetadata(props: { params: Props }) {
  const params = await props.params;
  const page = projectSource.getPage(params.slug);
  if (!page) notFound();
  return metatag({
    title: `${page?.data.title} | PRAS`,
    description: page?.data.description,
    image: page?.data.thumbnail,
    robots: "index, follow",
  });
}
