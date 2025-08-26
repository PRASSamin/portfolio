import { BASE_URL } from "@/constants/env";
import { source, projectSource } from "@/utils/source";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = source.getPages();
  const projects = projectSource.getPages();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...blogs.map((blog) => ({
      url: `${BASE_URL}${blog.url}`,
      lastModified: blog.data.updatedAt,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${BASE_URL}${project.url}`,
      lastModified: project.data.updatedAt,
      priority: 0.8,
    })),
  ];
}
