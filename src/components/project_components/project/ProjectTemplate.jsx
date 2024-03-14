import React from 'react'
import styled from 'styled-components';

const ProjectTemplate = ({ Thumbnail, Name, Type }) => {
    return (
        <Proj>
          <a href="">
            <div>
              <img src={Thumbnail} alt="" srcset="" />
            </div>
            <div className="mt-5">
              <h2>{Type}</h2>
              <h1>{Name}</h1>
            </div>
          </a>
        </Proj>
      );
}

const Proj = styled.a`
  img {
    border-radius: 6px;
    transition: 0.2s ease-in-out;
  }

  h2 {
    text-transform: uppercase;
    color: #717171;
    letter-spacing: 1px;
    font-size: 16px;
  }
  h1 {
    font-size: 25px;
    color: var(--text);
    font-weight: bold;
  }
`;


export default ProjectTemplate