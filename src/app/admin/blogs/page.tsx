import { metatag } from "@/utils/metatag";
import AdminBlogView from "./view";
import { cache } from "react";
import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";

const Blogs = cache(async () => {
  const p = await db.blog.findMany({
    orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
  });
  if (p.length === 0) return [];
  return BLOGSERIALIZER(p);
});

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Blogs | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminBlogPage = async () => {
  const blogs = await Blogs();
  return <AdminBlogView blogs={blogs} />;
};

export default AdminBlogPage;
