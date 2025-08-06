import EducationSection from "./components/Education";
import ExperienceSection from "./components/Experience";
import ExpertiseSection from "./components/Expertise";
import SocialSection from "./components/Social";
import AboutMeSection from "./components/AboutMe";
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
    <div className={`flex flex-col items-center pb-14 overflow-hidden`}>
      <AboutMeSection />
      {educations.length > 0 && <EducationSection educations={educations} />}
      {exps.length > 0 && <ExperienceSection experiences={exps} />}
      <ExpertiseSection />
      <SocialSection />
    </div>
  );
};

export default AboutPage;

export const generateMetadata = () => {
  return metatag({
    title: "About | PRAS",
    robots: "index, follow",
  });
};
