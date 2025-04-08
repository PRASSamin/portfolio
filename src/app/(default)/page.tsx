import HomeView from "./home/view";
import { db } from "@/utils/db";
import { PROJECTSERIALIZER } from "@/utils/serializers";
import { metatag } from "@/utils/metatag";

export default async function Home() {
  const projects = PROJECTSERIALIZER(
    await db.project.findMany({
      orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
    })
  );
  const totalProjects = 200 + projects.length;
  return <HomeView totalProjects={totalProjects} projects={projects} />;
}

Home.DisplayName = "Home";

export const generateMetadata = () => {
  return metatag({
    pageTitle: "Home | PRAS",
    robots: "index, follow",
  });
};
