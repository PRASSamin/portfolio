import { db } from "@/utils/db";
import { metatag } from "@/utils/metatag";
import { headers } from "next/headers";
import { source } from "@/utils/source";
import { notFound } from "next/navigation";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import { getMDXComponents, mdxComponents } from "@/mdx-components";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import ExpandableText from "@/components/ExpandableText";
import { Eye } from "lucide-react";
import { Heading } from "fumadocs-ui/components/heading";
import { geolocation } from "@vercel/functions";
import { NextRequest } from "next/server";
import Footer from "@/components/Footer";
import BlogsView from "../view";
import { getBlogs } from "@/utils/get-blogs";

type Props = Promise<{ slug?: string[] }>;

const BlogPage = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!slug) {
    const blogsData = await getBlogs({ page: 1, limit: 20 });
    return (
      <BlogsView
        initialBlogs={blogsData.blogs}
        totalPages={blogsData.totalPages}
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

  const tracker = await db.blogViewTracker.findUnique({
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
      db.blogStat.upsert({
        where: { slug: fSlug },
        create: { slug: fSlug, totalViews: 1 },
        update: { totalViews: { increment: 1 } },
      }),

      db.blogViewTracker.create({
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
      db.blogViewTracker.update({
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

      db.blogStat.update({
        where: { slug: fSlug },
        data: { totalViews: { increment: 1 } },
      }),
    ]);
  }

  // total views
  const blogStat = await db.blogStat.findUnique({
    where: { slug: fSlug },
    select: { totalViews: true },
  });

  page.data.views = blogStat?.totalViews;
  const MDX = page.data.body;

  return (
    <>
      <div
        className={`bg-background w-full min-h-[calc(100vh-44px)] pb-4 relative`}
      >
        <div />
        {page.data.thumbnail ? (
          <div className="relative w-full h-80">
            <Image
              src={page.data.thumbnail.replace(/\.(png|jpe?g)$/i, ".webp")}
              width={1200}
              height={600}
              alt={page.data.title}
              className="w-screen h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
          </div>
        ) : null}
        <div
          className={`lg:flex items-center justify-center max-w-[calc(100vw-2.5rem)] lg:max-w-full mx-auto relative z-50 ${
            page?.data?.thumbnail ? "-mt-28" : "mt-40"
          }`}
        >
          <div className="prose-invert prose !max-w-[100ch] w-full flex flex-col gap-6">
            {/* page.data Header */}
            <div className="h-full flex flex-col justify-between border-none not-prose">
              <h2 className="text-white text-4xl truncate font-bold capitalize pb-1.5">
                {page.data.title}
              </h2>
              <div>
                <ExpandableText
                  text={page.data.description || ""}
                  maxLength={"max"}
                  expandable={false}
                />
              </div>
              <div className="flex flex-col gap-4 mt-16">
                {/* Line */}
                <div className="h-[1px] bg-border w-full" />
                {/* page.data Meta */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatDate(page.data.createdAt, page.data.updatedAt)}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-2.5 flex gap-1.5 items-center text-[13px] ">
                      <Eye className="text-muted-foreground/70" size={16} />
                      <span>{page.data.views || 0} views</span>
                    </span>
                  </div>
                </div>
                {/* Line */}
                <div className="h-[1px] bg-border w-full" />
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

            <div className="prose-invert prose flex flex-col">
              <Heading
                as="h2"
                id="topics"
                className="border-l-[5px] border-theme-accent-1 pl-2.5 [&_a]:!no-underline"
              >
                Topics
              </Heading>
              <div className="flex gap-2 items-center scrollbar-hidden">
                {page.data?.tags &&
                  page.data?.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-theme-accent-1/20 border border-theme-accent-1 rounded-full text-[13px] text-theme-accent-1 font-semibold select-none"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;

export async function generateStaticParams() {
  return source.generateParams();
}
export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return metatag({
    title: `${page.data.title} | PRAS`,
    description: page.data.description,
    image: page.data.thumbnail,
    robots: "index, follow",
  });
}
