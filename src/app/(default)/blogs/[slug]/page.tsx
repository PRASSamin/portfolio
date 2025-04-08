import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import BlogPageView from "./view";
import { metatag } from "@/utils/metatag";
import { cache } from "react";

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

  const html = await prepareMarkdown(blog?.content);
  return <BlogPageView blog={blog} content={html} />;
};

export default BlogPage;
