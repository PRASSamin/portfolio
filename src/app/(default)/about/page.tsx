import EducationSection from "./components/education";
import ExperienceSection from "./components/experience";
import ExpertiseSection from "./components/expertise";
import SocialSection from "./components/social";
import AboutMeSection from "./components/aboutme";
import { metatag } from "@/utils/metatag";
import { db } from "@/utils/db";
import { EDUCATIONSERIALIZER, EXPERIENCESERIALIZER } from "@/utils/serializers";

const AboutPage = async () => {
  const exps = EXPERIENCESERIALIZER(
    (await db.experience.findMany({ orderBy: { start: "desc" } })) || []
  );
  const educations = EDUCATIONSERIALIZER(
    (await db.education.findMany({ orderBy: { start: "desc" } })) || []
  );

  return (
    <div className={`flex flex-col items-center pt-5 pb-14 overflow-hidden`}>
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
    pageTitle: "About | PRAS",
    robots: "index, follow",
  });
};
