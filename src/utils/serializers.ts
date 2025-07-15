import { format } from "date-fns";

export const PROJECTSERIALIZER = (projects: any) => {
  if (!projects) return null; // Handle null input
  if (typeof projects !== "object") return null; // Handle non-object input

  // main serializer function
  const serializer = (project: any) => {
    return {
      id: project.id,
      title: project.title,
      description: project?.description,
      image: project.image,
      category: project.category,
      link: {
        github: project?.github,
        live: project?.live,
      },
      slug: project.slug,
      tools: project.tools,
      content: project?.content || null,
      views: project?._count?.views || null,
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  };

  return typeof projects === "object" && !Array.isArray(projects)
    ? serializer(projects) // single project
    : projects.length <= 0
    ? [] // no project
    : projects.map((project: any) => {
        return serializer(project);
      }); // array of projects
};

export const BLOGSERIALIZER = (blogs: any) => {
  if (!blogs) return null; // Handle null input
  if (typeof blogs !== "object") return null; // Handle non-object input

  // main serializer function
  const serialize = (blog: any) => {
    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      tags: blog.tags,
      thumbnail: blog.thumbnail || null,
      views: blog?._count?.views || null,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
    };
  };

  return typeof blogs === "object" && !Array.isArray(blogs)
    ? serialize(blogs) // single blog
    : blogs.length <= 0
    ? [] // no blogs
    : blogs?.map((blog: any) => {
        return serialize(blog);
      }); // array of blogs
};

export const EXPERIENCESERIALIZER = (experiences: any) => {
  if (!experiences) return null; // Handle null input
  if (typeof experiences !== "object") return null; // Handle non-object input

  // main serializer function
  const serializer = (experience: any) => {
    return {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      description: experience?.description,
      period: `${format(experience.start, "MMMM yyyy")} - ${
        format(experience?.end, "MMMM yyyy") || "Present"
      }`,
      start: experience?.start,
      end: experience?.end || "Present",
      created_at: experience.created_at,
      updated_at: experience.updated_at,
    };
  };

  return typeof experiences === "object" && !Array.isArray(experiences)
    ? serializer(experiences) // single experience
    : experiences.length <= 0
    ? [] // no experiences
    : experiences.map((experience: any) => {
        return serializer(experience);
      }); // array of experiences
};

export const EDUCATIONSERIALIZER = (educations: any) => {
  if (!educations) return null; // Handle null input
  if (typeof educations !== "object") return null; // Handle non-object input

  // main serializer function
  const serializer = (education: any) => {
    return {
      id: education.id,
      degree: education.degree,
      field: education.field,
      school: education.school,
      description: education?.description,
      period: `${format(education.start, "MMMM yyyy")} - ${
        format(education?.end, "MMMM yyyy") || "Present"
      }`,
      start: education?.start,
      end: education?.end || "Present",
      created_at: education.created_at,
      updated_at: education.updated_at,
    };
  };

  return typeof educations === "object" && !Array.isArray(educations)
    ? serializer(educations) // single education
    : educations.length <= 0
    ? [] // no educations
    : educations.map((education: any) => {
        return serializer(education);
      }); // array of educations
};
