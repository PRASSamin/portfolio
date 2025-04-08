import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";
import { BlogType } from "@/types";
import { metatag } from "@/utils/metatag";
import BlogsView from "./view";

const BlogsPage = async () => {
  const allBlogs: BlogType[] = BLOGSERIALIZER(
    await db.blog.findMany({
      orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
    })
  );

  return <BlogsView allBlogs={allBlogs} />;
};

BlogsPage.displayName = "BlogsPage";
export default BlogsPage;

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Blogs | PRAS",
    robots: "index, follow",
  });
};
