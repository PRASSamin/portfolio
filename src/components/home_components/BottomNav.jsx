import React from "react";
import PRASLogo from "../../assets/images/logo-b.svg";
import styled from "styled-components";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <Nav className="mb-5">
      <div className="pt-24 pb-16 container flex mx-auto gap-28">
          <div className="w-1/3 flex flex-col justify-start items-start">
              <img className="w-40 object-cover mb-8" src={PRASLogo} alt="" />
            <p className="text-lg font-medium text-MyGray leading-8">
              Embark on a journey through my digital universe. Uncover innovative
              projects, creative experiments, and solutions that redefine the
              digital landscape. Let's code the future together!
            </p>
          </div>
          <div className="w-1/3 flex flex-col justify-center items-center">
            <ul className="uppercase leading-9 text-lg font-medium flex flex-col text-MyGray">
              <li>
                <Link to={"/home"}>Home</Link>
              </li>
              <li>
                <Link to={"/projects"}>Projects</Link>
              </li>
              <li>
                <Link to={"/blogs"}>Blogs</Link>
              </li>
              <li>
                <Link to={"/about"}>About</Link>
              </li>
              <li>
                <a href="mailto:prassamin@gmail.com?subject=From%20Portfolio%3A%20">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-1/3 flex flex-col justify-center items-center gap-8">
            <p className="text-center leading-8 text-lg font-medium text-MyGray">
              Connect with me for collaboration or a chat. Let's explore together!
            </p>
            <a href="mailto:prassamin@gmail.com?subject=From%20Portfolio%3A%20">
              <Email>prassamin@gmail.com</Email>
            </a>
          </div>
      </div>
    </Nav>
  );
};

const Nav = styled.div`
border-bottom: 2px solid black;

`;

const Email = styled.h1`
  font-size: 28px;
  font-weight: 700;
  font-family: "Palatino", sans-serif;
`;

export default BottomNav;