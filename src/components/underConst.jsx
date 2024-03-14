import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import prasLogo from "../assets/images/logo-b.svg";
import prasBG from "../assets/images/webdevelopment.svg";
import { Link } from "react-router-dom";



const UnderConst = ({pageTitle}) => {

  useEffect(() => {
    document.title = 'Error'; 
    return () => {
      document.title = 'Portfolio';
    };
  }, []);

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
        <NavContent className="container mx-auto flex-column items-start justify-start flex">
          <div className="mb-72 w-1/2 flex my-self flex-col items-start">
            <h2 className="uppercase text-3xl font-medium pb-3">Webpage Is Under</h2>
            <h1 className="uppercase">Construction</h1>
          <button className="bg-black text-white py-3 px-16 rounded-xl text-lg font-bold  mt-10"><Link to={"/home"}>Home</Link></button>
          </div>
          <div className=" w-1/2 flex my-self flex-col items-end">
            <img className="mt-96" src={prasBG} alt="" />          </div>
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
  height: 919px;
  background-color: #FFFFFF;

  img {
    height: 30px;
  }
`;

const NavContent = styled.div`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .my-self {
    flex-direction: column;
    justify-content: center;
  }

  img {
    height: 400px;
  }

  h1 {
    font-size: 90px;
    font-weight: 800;
    line-height: 80px;
  }

`;


export default UnderConst;
