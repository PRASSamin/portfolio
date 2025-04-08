import AdminDashboardView from "./dashboard/view";

// const Experiences = cache(async () => {
//   const p = await db.experience.findMany({
//     orderBy: [{ start: "desc" }],
//   });
//   if (p.length === 0) return [];
//   return EXPERIENCESERIALIZER(p);
// });

// export const generateMetadata = () => {
//   return metatag({
//     pageTitle: "Experiences | Admin",
//     robots: "noindex, nofollow",
//   });
// };

const AdminDashboardPage = async () => {
  return <AdminDashboardView />;
};

export default AdminDashboardPage;
