import { db } from "@/utils/db";
import { ProjectType } from "@/types";
import { PROJECTSERIALIZER } from "@/utils/serializers";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import ProjectView from "./view";
import { cache } from "react";
import { metatag } from "@/utils/metatag";

type Props = Promise<{ slug: string }>;

const getProject = cache(async (slug: string) => {
  const project = await db.project.findUnique({
    where: { slug },
  });

  if (!project) return null;
  return PROJECTSERIALIZER(project);
});

export const generateMetadata = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const blog = await getProject(slug);

  if (!blog)
    return metatag({
      pageTitle: "Project Not Found | PRAS",
      robots: "noindex, nofollow",
    });

  return metatag({
    pageTitle: `${blog.title} | PRAS`,
    robots: "index, follow",
    description: blog.description,
  });
};

const ProjectPage = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const project: ProjectType = await getProject(slug);

  const html = await prepareMarkdown(project?.content || "");

  return <ProjectView project={project} content={html} />;
};

export default ProjectPage;
