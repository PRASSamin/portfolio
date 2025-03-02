import { db } from "@/utils/db";
import { metatag } from "@/utils/metatag";
import { PROJECTSERIALIZER } from "@/utils/serializers";
import ProjectPageView from "./view";

const ProjectPage = async () => {
  const projects = PROJECTSERIALIZER(
    await db.project.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    })
  );
  return <ProjectPageView projects={projects} />;
};

ProjectPage.displayName = "ProjectPage";

export default ProjectPage;

export const generateMetadata = async () => {
  return metatag({
    pageTitle: "Projects | PRAS Samin",
    robots: "index, follow",
  });
};
