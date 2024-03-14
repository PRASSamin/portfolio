import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import BlogPosts from "./BlogPosts";
import { motion, useAnimation } from "framer-motion";

const Blog = () => {
  const blogRef = useRef(null);
  const controls = useAnimation();
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const blogElement = blogRef.current;

    const handleScroll = () => {
      const { y } = blogElement.getBoundingClientRect();
      if (y < window.innerHeight * 0.8 && !isAnimated) {
        controls.start("visible");
        setIsAnimated(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, isAnimated]);

  return (
    <section className="mb-28" ref={blogRef}>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, y: 0 },
        }}
        className="container mx-auto flex flex-col py-24"
      >
        <div className="flex gap-10 ">
          <div className="w-1/3">
            <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`} 
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            />
          </div>
          <div className="w-1/3">
            {/* <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`} 
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            /> */}
          </div>
          <div className="w-1/3">
            {/* <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`} 
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            /> */}
          </div>
        </div>
      </motion.section>
    </section>
  );
};

const StyledBlogs = styled.section`
  p {
    color: #303030;
    font-size: 18px;
    margin-bottom: 60px;
    margin-top: 14px;
  }
`;

export default Blog;
