import styled from "styled-components";
import RecipeRealm from "../../../assets/images/recipe-realm.jpg";
import PRASWeather from "../../../assets/images/pras-weather.jpg";
import SpectrumTheme from "../../../assets/images/spectrum-theme.png";
import PRASDownloader from "../../../assets/images/PRAS-Downloader.jpg";
import ProjectTemplate from "./ProjectTemplate";
import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";


const ProjectsCompo = () => {

  const projectRef = useRef(null);
  const controls = useAnimation();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const projectElement = projectRef.current;

    const handleScroll = () => {
      const { y } = projectElement.getBoundingClientRect();
      if (y < window.innerHeight * 0.8 && !isAnimated) {
        controls.start("visible");
        setIsAnimated(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, isAnimated]);



  return (
    <section className="mb-28" ref={projectRef}>
      <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 1 }}
      variants={{
        visible: { opacity: 1, y: 0 },
      }}
      className="container mx-auto">
      <ProjTitle className="flex items-center">
      </ProjTitle>
      <div className="flex flex-wrap justify-between">
        <div className="w-1/3 p-10">
          <ProjectTemplate
            Thumbnail={RecipeRealm}
            Type={`Flutter Application`}
            Name={`Recipe Realm`}
          />
        </div>
        <div className="w-1/3 p-10">
          <ProjectTemplate
            Thumbnail={PRASWeather}
            Type={`Flutter Application`}
            Name={`PRAS Weather`}
          />
        </div>
        <div className="w-1/3 p-10">
          <ProjectTemplate
            Thumbnail={SpectrumTheme}
            Type={`vscode theme`}
            Name={`PRAS Spectrum Theme`}
          />
        </div>
        <div className="w-1/3 p-10">
          <ProjectTemplate
            Thumbnail={PRASDownloader}
            Type={`website`}
            Name={`PRAS Downloader`}
          />
        </div>
      </div>
    </motion.section>
    </section>
  );
};


const ProjTitle = styled.div`
  margin-top: 50px;
  margin-bottom: 40px;
  

  h1 {
    font-size: 58px;
    font-weight: 700;
  }
  h2 {
    font-size: 19px;
    border-bottom: 1px solid #000;
    margin-top: 15px;
    margin-left: 60px;
    text-transform: uppercase;
  }
`;


export default ProjectsCompo;
