import { db } from "@/utils/db";
import { EXPERIENCESERIALIZER, EDUCATIONSERIALIZER } from "@/utils/serializers";
import EducationSection from "./components/education";
import ExperienceSection from "./components/experience";
import ExpertiseSection from "./components/expertise";
import SocialSection from "./components/social";
import AboutMeSection from "./components/aboutme";
import { metatag } from "@/utils/metatag";

const AboutPage = async () => {
  const exps = EXPERIENCESERIALIZER(
    (await db.experience.findMany({ orderBy: { createdAt: "desc" } })) || []
  );
  const educations = EDUCATIONSERIALIZER(
    (await db.education.findMany({ orderBy: { createdAt: "desc" } })) || []
  );

  return (
    <div
      className={`flex flex-col items-center w-[calc(100vw-2rem)] lg:container mx-auto gap-28 pt-5 pb-14`}
    >
      <AboutMeSection />
      <EducationSection educations={educations} />
      <ExperienceSection experiences={exps} />
      <ExpertiseSection />
      <SocialSection />
    </div>
  );
};

export default AboutPage;

export const generateMetadata = () => {
  return metatag({
    pageTitle: "About | PRAS Samin",
    robots: "index, follow",
  });
};
