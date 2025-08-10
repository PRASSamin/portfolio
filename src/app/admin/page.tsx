import { metatag } from "@/utils/metatag";
import AdminDashboardView from "./dashboard/view";
import { getBlogs } from "@/utils/get-blogs";
import { getProjects } from "@/utils/get-projects";

export const generateMetadata = () => {
  return metatag({
    title: "Dashboard | Admin",
    robots: "noindex, nofollow",
  });
};

const AdminDashboardPage = async () => {
  const [blogs, projects] = await Promise.all([
    getBlogs({ limit: "all", sortBy: "views" }),
    getProjects({ limit: "all", sortBy: "views" }),
  ]);

  // Sum total views from the full lists
  const totalBlogViews = blogs.blogs.reduce(
    (sum, b) => sum + (b.views || 0),
    0
  );
  const totalProjectViews = projects.projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );
  const totalViews = totalBlogViews + totalProjectViews;

  return (
    <AdminDashboardView
      totalViews={totalViews}
      blogViews={blogs.blogs}
      projectViews={projects.projects}
    />
  );
};

export default AdminDashboardPage;