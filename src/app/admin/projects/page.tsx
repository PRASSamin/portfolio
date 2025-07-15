import { metatag } from "@/utils/metatag";
import AdminProjectView from "./view";
import { db } from "@/utils/db";
import { PROJECTSERIALIZER } from "@/utils/serializers";

const Projects = async () => {
  const p = await db.project.findMany({
    orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
    take: 5,
    include: {
      _count: {
        select: {
          views: true,
        },
      },
    },
  });
  if (p.length === 0) return [];
  return PROJECTSERIALIZER(p);
};

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Projects | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminProjectPage = async () => {
  const projects = await Projects();
  return <AdminProjectView projects={projects} />;
};

export default AdminProjectPage;
