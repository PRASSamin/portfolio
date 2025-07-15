import { metatag } from "@/utils/metatag";
import BlogsView from "./view";
import { db } from "@/utils/db";

const LIMIT = 20;

const BlogsPage = async () => {
  const totalPage = Math.ceil((await db.blog.count()) / LIMIT);
  return <BlogsView totalPages={totalPage} LIMIT={LIMIT} />;
};

BlogsPage.displayName = "BlogsPage";
export default BlogsPage;

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Blogs | PRAS",
    robots: "index, follow",
  });
};
