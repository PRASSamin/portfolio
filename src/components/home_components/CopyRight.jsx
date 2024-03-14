import React from "react";
import styled from "styled-components";

const CopyRight = () => {
  return (
    <Copyright className="mb-3 container mx-auto">
      <div className="flex items-center justify-between">
        <div className="gap-10 flex">
          <a
            title="Instagram"
            href="https://www.instagram.com/imprassamin/"
            target="_blank"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a title="X" href="https://twitter.com/prassamin78" target="_blank">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a title="DEV" href="https://dev.to/prassamin" target="_blank">
            <i className="fa-brands fa-dev"></i>
          </a>
          <a title="Github" href="https://github.com/PRASSamin" target="_blank">
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            title="Linkedin"
            href="https://www.linkedin.com/in/pras-samin-826421270/"
            target="_blank"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            title="Medium"
            href="https://www.linkedin.com/in/pras-samin-826421270/"
            target="_blank"
          >
            <i className="fa-brands fa-medium"></i>
          </a>
        </div>
        <h1 className="copyrighttxt">©2024 <a href="">PRAS.</a> All rights reserved.
</h1>
      </div>
    </Copyright>
  );
};

const Copyright = styled.div`
  .fa-instagram,
  .fa-x-twitter,
  .fa-dev,
  .fa-github,
  .fa-linkedin,
  .fa-medium {
    color: #000000;
    font-size: 20px;
    padding: 10px;
    border-radius: 50%;
    transition: .2s ease-in-out;
  }

  .fa-instagram:hover,
  .fa-x-twitter:hover,
  .fa-dev:hover,
  .fa-github:hover,
  .fa-linkedin:hover,
  .fa-medium:hover
   {
    text-shadow: 0 0 10px #00000052, 0 0 20px #00000063, 0 0 30px #00000053;
  }

  .copyrighttxt {
    font-size: 17px;
    color: #303030;

    a {
        font-weight: 700;
    }
  }

`;

export default CopyRight;
