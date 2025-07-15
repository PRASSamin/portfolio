import { db } from "@/utils/db";
import { PROJECTSERIALIZER } from "@/utils/serializers";
import { prepareMarkdown } from "@/utils/prepMarkdown";
import ProjectView from "./view";
import { cache } from "react";
import { metatag } from "@/utils/metatag";
import { headers } from "next/headers";

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
  const project = await getProject(slug);
  if (!project) return null;
  const Headers = await headers();

  const html = await prepareMarkdown(project.content);

  const ip =
    Headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    Headers.get("x-real-ip") ||
    "unknown";

  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

  const recentView = await db.projectViews.findFirst({
    where: {
      project_id: project.id,
      ip_address: ip,
      created_at: { gte: threeMinutesAgo },
    },
  });

  if (!recentView) {
    await db.projectViews.create({
      data: {
        project_id: project.id,
        ip_address: ip,
      },
    });
  }

  const views = await db.projectViews.count({
    where: {
      project_id: project.id,
    },
  });

  project.views = views;

  return <ProjectView project={project} content={html} />;
};

export default ProjectPage;
