import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import prasLogo from "../../assets/images/logo-b.svg";
import prasBG from "../../assets/images/bg.jpg";
import { Link } from "react-router-dom";



const NavArea = ({pageTitle}) => {
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
        
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <NavContent className="container mx-auto flex-column flex">
          <div className="flex my-self flex-col">
            <h1 className="uppercase">{pageTitle}</h1>
          </div>
        </NavContent>
      </motion.div>
    </Container>
  );
};

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

const NavContent = styled.div`
  flex-direction: row;
  justify-content: center;
  margin-top: 350px;
  align-items: center;

  .my-self {
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 90px;
    font-weight: 800;
    line-height: 80px;
  }

`;


export default NavArea;
