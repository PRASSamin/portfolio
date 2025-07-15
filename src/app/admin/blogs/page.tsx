import { metatag } from "@/utils/metatag";
import AdminBlogView from "./view";
import { db } from "@/utils/db";
import { BLOGSERIALIZER } from "@/utils/serializers";

const Blogs = async () => {
  const p = await db.blog.findMany({
    orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
    include: {
      _count: {
        select: {
          views: true,
        },
      },
    },
  });
  if (p.length === 0) return [];
  return BLOGSERIALIZER(p);
};

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
