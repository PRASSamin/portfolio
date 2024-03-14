import flutterLogo from "../../../assets/images/flutter.svg";
import codeLogo from "../../../assets/images/code.svg";
import ServiceTemplates from "./ServiceTemplate";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";


const Services = () => {


    const serviceRef = useRef(null);
    const controls = useAnimation();
    const [isAnimated, setIsAnimated] = useState(false);
  
    useEffect(() => {
      const servicElement = serviceRef.current;
  
      const handleScroll = () => {
        const { y } = servicElement.getBoundingClientRect();
        if (y < window.innerHeight * 0.8 && !isAnimated) {
          controls.start("visible");
          setIsAnimated(true);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [controls, isAnimated]);
  


  return (
    <section ref={serviceRef}>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, y: 0 },
        }} 
      className="container mx-auto pt-12 pb-28">
        <ServTitle className="flex flex-col">
          <h1>Our services</h1>
          <p>
            Discover our suite of services tailored to your needs. From
            consultations to solutions, we're here to elevate your experience{" "}
          </p>
        </ServTitle>
        <div className="flex space-x-8">
          <ServiceTemplates
            title="Web Development"
            description={`Transforming visions into digital reality, our web development
          service crafts seamless online experiences tailored to your
          brand's identity and audience. Harness the power of cutting-edge
          technologies to stand out in the digital landscape.`}
            icon={codeLogo}
            iconSize="65px"
          />
          <ServiceTemplates
            title="Flutter Development"
            description={`Empowering cross-platform innovation, our Flutter development
            service crafts dynamic mobile experiences that seamlessly engage
            users across iOS and Android. Unlock the full potential of your
            app ideas with our expertise in cutting-edge technologies.`}
            icon={flutterLogo}
            iconSize="52px"
          />
        </div>
      </motion.section>
    </section>
  );
};


const ServTitle = styled.main`
  margin-top: 100px;

  h1 {
    font-size: 58px;
    font-weight: 700;
  }

  p {
    font-size: 18px;
    max-width: 50%;
  }
`;



export default Services;
