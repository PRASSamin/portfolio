import { db } from "@/utils/db";
import { metatag } from "@/utils/metatag";
import ProjectPageView from "./view";

const LIMIT = 20;

const ProjectPage = async () => {
  const totalPage = Math.ceil((await db.project.count()) / LIMIT);
  return <ProjectPageView totalPages={totalPage} LIMIT={LIMIT} />;
};

ProjectPage.displayName = "ProjectPage";

export default ProjectPage;

export const generateMetadata = async () => {
  return metatag({
    pageTitle: "Projects | PRAS",
    robots: "index, follow",
  });
};
