import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import prasLogo from "../../assets/images/logo-b.svg";
import prasBG from "../../assets/images/bg.jpg";
import CVCheck from "../home_components/topnav/CVCheck";
import { Link } from "react-router-dom";

const NavArea = () => {
  const [isVisible, setIsVisible] = useState(false);

  function ButtonClick() {
    setIsVisible(!isVisible);

    setTimeout(() => {
      setIsVisible(isVisible);
    }, 1000);
  }

  return (
    <Container>
      <div className="container mx-auto pt-5 flex justify-between">
        <a href="">
          <img src={prasLogo} alt="" srcSet="" />
        </a>
        <NavList>
          <Link to={"/home"}>
            <li>Home</li>
          </Link>
          <Link to={"/projects"}>
            <li>Projects</li>
          </Link>
          <a target="_blank" href="https://github.com/PRASSamin">
            <li>Github</li>
          </a>
          <Link to={"/blogs"}>
            <li>Blogs</li>
          </Link>
          <Link to={"/about"}>
            <li>about</li>
          </Link>
          
        </NavList>
      </div>
      <motion.div
        className="container mx-auto flex-column flex"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ContentWrapper>
          <motion.div
             className="my-self"
             initial={{ opacity: 0, x: -100 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1>PRAS Samin</h1>
            <h2>Developer</h2>
            <p>
              Proficient in web development and Flutter, I specialize in
              creating dynamic and user-friendly applications. With a keen eye
              for detail and a passion for innovation, I aim to deliver
              seamless experiences across platforms, combining cutting-edge
              technology with intuitive design.
            </p>
            <DownloadButton>
              <button onClick={ButtonClick}>DOWNLOAD CV</button>
              <motion.div
                className={`transition ${isVisible ? "fade-in" : "fade-out"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }} // Adjust the duration here
              >
                {isVisible && <CVCheck />}
              </motion.div>
            </DownloadButton>
          </motion.div>
          <motion.div
            className="social"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              title="Instagram"
              href="https://www.instagram.com/imprassamin/"
              target="_blank"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              title="X"
              href="https://twitter.com/prassamin78"
              target="_blank"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a title="DEV" href="https://dev.to/prassamin" target="_blank">
              <i className="fa-brands fa-dev"></i>
            </a>
            <a
              title="Github"
              href="https://github.com/PRASSamin"
              target="_blank"
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              title="Linkedin"
              href="https://www.linkedin.com/in/pras-samin-826421270/"
              target="_blank"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </motion.div>
        </ContentWrapper>
      </motion.div>
    </Container>
  );
};

export default NavArea;

const NavList = styled.ul`
  display: flex;
  gap: 50px;

  li {
    font-size: 20px;
    text-transform: uppercase;
  }
`;

const Container = styled.div`
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: center !important;
  height: 919px;
  background: url(${prasBG});

  img {
    height: 30px;
  }
`;

const ContentWrapper = styled.div`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 250px;
  align-items: center;
  display: flex;

  .my-self {
    flex-direction: column;
    justify-content: start;
    padding-right: 30px;
  }

  .social{
     gap: 20px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.725);
  padding: 12px 5px;
  border-radius: 10px;

  .fa-instagram,
  .fa-x-twitter,
  .fa-dev,
  .fa-github,
  .fa-linkedin {
    color: #9a9a9a;
    font-size: 20px;
    padding: 10px;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
  }

  .fa-instagram:hover,
  .fa-x-twitter:hover,
  .fa-dev:hover,
  .fa-github:hover,
  .fa-linkedin:hover {
    color: #ffffff;

  }
}

  p {
    max-width: 50%;
    font-size: 19px;
  }
  h1 {
    font-size: 70px;
    font-weight: 800;
    line-height: 80px;
  }

  h2 {
    font-size: 45px;
    font-weight: 400;
  }
`;

const DownloadButton = styled.div`
  button {
    background-color: rgba(0, 0, 0, 0.657);
    color: #fff;
    font-size: 19px;
    padding: 15px 30px;
    border-radius: 8px;
    margin-top: 40px;
    transition: 0.3s all;
    outline: none;
    border: none;
  }
  button:hover {
    background-color: rgb(0, 0, 0);
    color: #fff;
    outline: none;
    border: none;
  }
  .transition {
    transition: opacity 0.1s ease-in-out;
  }

  .fade-in {
    opacity: 1;
  }

  .fade-out {
    opacity: 0;
  }

  h1 {
    font-size: 20px;
    font-weight: 500;
  }
`;



