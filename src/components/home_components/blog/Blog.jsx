import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import BlogPosts from "./BlogPosts";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

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
    <section ref={blogRef}>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
        variants={{
          visible: { opacity: 1, y: 0 },
        }}
        className="container mx-auto flex flex-col py-32"
      >
        <div>
          <h1 className="text-center text-6xl font-bold mb-3">Latest News</h1>
          <p className="text-center mb-16 text-lg">
            Explore our latest insights and updates, offering valuable
            perspectives on diverse subjects.
          </p>
        </div>
        <div className="flex gap-5 ">
          <div className="w-1/3">
            <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`}
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            />
          </div>
          <div className="w-1/3">
            <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`} 
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            />
          </div>
          <div className="w-1/3">
            <BlogPosts
              thumbLink={`https://pbs.twimg.com/media/GIdHODPbAAAnCB1?format=jpg&name=medium`}
              from="Twitter / Mar 12, 2024"
              caption="AI Generate Photo"
              Source={`https://twitter.com/prassamin78/status/1767459815876686098`}
            />
          </div>
        </div>
        <button className="uppercase mt-16 mx-auto border-2 border-black px-12 py-4 rounded-lg">
          <Link to={"/blogs"}>View all blogs</Link>
        </button>
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
