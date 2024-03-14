import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";

const Exp = () => {
  const expRef = useRef(null);
  const controls = useAnimation();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const expElement = expRef.current;

    const handleScroll = () => {
      const { y } = expElement.getBoundingClientRect();
      if (y < window.innerHeight * 0.8 && !isAnimated) {
        controls.start("visible");
        setIsAnimated(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, isAnimated]);

  return (
    <ExpSection ref={expRef}>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, y: 0 },
        }}
        className="flex container mx-auto justify-center pt-28 pb-28"
      >
        <div className="flex items-center mx-auto">
          <h1>4</h1>
          <div className="flex flex-col ml-3">
            <h2>YEARS OF</h2>
            <h2>EXPERIENCE</h2>
          </div>
        </div>
        <div className="flex items-center mx-auto">
          <h1>200+</h1>
          <div className="flex flex-col ml-3">
            <h2>PROJECTS</h2>
            <h2>completed</h2>
          </div>
        </div>
      </motion.section>
    </ExpSection>
  );
};

const ExpSection = styled.section`
  background: rgb(245, 245, 241);
  background: linear-gradient(
    360deg,
    rgba(245, 245, 241, 0) 50%,
    rgba(245, 245, 241, 1) 100%
  );
  h1 {
    font-size: 68px;
    font-weight: 600;
  }

  h2 {
    color: #9a9a9a;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 500;
  }
`;

export default Exp;
