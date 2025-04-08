import { metatag } from "@/utils/metatag";
import AdminProjectView from "./view";
import { cache } from "react";
import { db } from "@/utils/db";
import { PROJECTSERIALIZER } from "@/utils/serializers";

const Projects = cache(async () => {
  const p = await db.project.findMany({
    orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
  });
  if (p.length === 0) return [];
  return PROJECTSERIALIZER(p);
});

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
