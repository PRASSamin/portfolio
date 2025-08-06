import { GITHUB_API_KEY } from "@/constants/env";
import HomeView from "./home/view";
import { getProjects } from "@/utils/get-projects";
import { metatag } from "@/utils/metatag";
import { cache } from "react";

const getPRASGithub = cache(async () => {
  try {
    const res = await fetch(`https://api.github.com/user`, {
      next: { revalidate: 600 }, // 10m
      headers: {
        Authorization: `Bearer ${GITHUB_API_KEY}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch GitHub user: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
});
export default async function Home() {
  const pras = await getPRASGithub();
  let repoCount = 0;
  if (pras) {
    repoCount += pras.public_repos;
    repoCount += pras.total_private_repos;
  }
  const projects = await getProjects({
    page: 1,
    limit: 4,
    sortBy: "created_at",
  });
  return <HomeView totalProjects={repoCount} projects={projects.projects} />;
}

Home.DisplayName = "Home";

export const generateMetadata = () => {
  return metatag({
    title: "Home | PRAS",
    robots: "index, follow",
  });
};
