import { db } from "@/utils/db";
import { metatag } from "@/utils/metatag";
import { PROJECTSERIALIZER } from "@/utils/serializers";
import ProjectPageView from "./view";

const ProjectPage = async () => {
  const projects = PROJECTSERIALIZER(
    await db.project.findMany({
      orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
    })
  );
  return <ProjectPageView projects={projects} />;
};

ProjectPage.displayName = "ProjectPage";

export default ProjectPage;

export const generateMetadata = async () => {
  return metatag({
    pageTitle: "Projects | PRAS",
    robots: "index, follow",
  });
};
