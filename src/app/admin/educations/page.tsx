import { metatag } from "@/utils/metatag";
import AdminEduView from "./view";
import { cache } from "react";
import { db } from "@/utils/db";
import { EDUCATIONSERIALIZER } from "@/utils/serializers";

const Educations = cache(async () => {
  const p = await db.education.findMany({
    orderBy: [{ start: "desc" }],
  });
  if (p.length === 0) return [];
  return EDUCATIONSERIALIZER(p);
});

export const generateMetadata = () => {
  return metatag({
    title: "Educations | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminBlogPage = async () => {
  const educations = await Educations();

  return <AdminEduView educations={educations} />;
};

export default AdminBlogPage;
