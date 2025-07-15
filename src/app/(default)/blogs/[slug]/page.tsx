import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import BlogPageView from "./view";
import { metatag } from "@/utils/metatag";
import { cache } from "react";
import { headers } from "next/headers";

type Props = Promise<{ slug: string }>;

const getBlog = cache(async (slug: string) => {
  const blogData = await db.blog.findUnique({
    where: { slug },
  });

  if (!blogData) return null;
  return BLOGSERIALIZER(blogData);
});

export const generateMetadata = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog)
    return metatag({
      pageTitle: "Blog Not Found | PRAS",
      robots: "noindex, nofollow",
    });

  return metatag({
    pageTitle: `${blog.title} | PRAS`,
    robots: "index, follow",
    description: blog.description,
  });
};

const BlogPage = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return null;
  const Headers = await headers();

  const html = await prepareMarkdown(blog.content);

  const ip =
    Headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    Headers.get("x-real-ip") ||
    "unknown";

  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

  const recentView = await db.blogViews.findFirst({
    where: {
      blog_id: blog.id,
      ip_address: ip,
      created_at: { gte: threeMinutesAgo },
    },
  });

  if (!recentView) {
    await db.blogViews.create({
      data: {
        blog_id: blog.id,
        ip_address: ip,
      },
    });
  }

  const views = await db.blogViews.count({
    where: {
      blog_id: blog.id,
    },
  });

  blog.views = views;

  return <BlogPageView blog={blog} content={html} />;
};

export default BlogPage;
