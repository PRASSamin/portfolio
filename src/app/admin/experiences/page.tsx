import { metatag } from "@/utils/metatag";
import AdminExpView from "./view";
import { cache } from "react";
import { db } from "@/utils/db";
import { EXPERIENCESERIALIZER } from "@/utils/serializers";

const Experiences = cache(async () => {
  const p = await db.experience.findMany({
    orderBy: [{ start: "desc" }],
  });
  if (p.length === 0) return [];
  return EXPERIENCESERIALIZER(p);
});

export const generateMetadata = () => {
  return metatag({
    title: "Experiences | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminBlogPage = async () => {
  const experiences = await Experiences();

  return <AdminExpView experiences={experiences} />;
};

export default AdminBlogPage;
