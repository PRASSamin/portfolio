import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().url("Invalid Thumbnail URL"),
  github: z.string().url("Invalid GitHub URL").optional(),
  live: z.string().url("Invalid Live URL").optional(),
  category: z.string().min(1, "Category is required"),
  tools: z.array(z.number()).optional(),
  content: z.string().optional(),
});

export const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).default([]),
  content: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().url("Invalid Thumbnail URL").nullable().optional(),
});

export const EducationSchema = z.object({
  school: z.string().min(1, "School is required").trim(),
  degree: z.string().min(1, "Degree is required").trim(),
  field: z.string().min(1, "Field of study is required").trim(),
  description: z
    .string()
    .trim()
    .max(3000, "Description is too long")
    .optional(),
  start: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid Date",
  }),
  end: z
    .union([
      z.date({ invalid_type_error: "End date must be a valid Date" }),
      z.undefined(),
    ])
    .optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").trim(),
  role: z.string().min(1, "Job role is required").trim(),
  description: z
    .string()
    .trim()
    .max(3000, "Description is too long")
    .optional(),
  start: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid Date",
  }),
  end: z
    .union([
      z.date({ invalid_type_error: "End date must be a valid Date" }),
      z.undefined(),
    ])
    .optional(),
});
