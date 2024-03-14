import React from "react";
import styled from "styled-components";
import Projects from "./project/Projects";
import Exp from "./experience/Exp";
import Blog from "./blog/Blog";
import Services from "./service/Services";

const Main = () => {
  return (
    <MainContainer>
      <Services />
      <Projects />
      <Expdetails>
        <Exp />
      </Expdetails>
      <Blog />
    </MainContainer>
  );
};

const MainContainer = styled.main``;

const Expdetails = styled.div`
  background: rgba(229, 231, 235, 1);
`;

export default Main;
