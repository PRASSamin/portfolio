import React from "react";
import styled from "styled-components";

const ProgressTemplate = ({progress}) => {
  return (
    <Pro className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </Pro>
  );
};


const Pro = styled.div`


.progress {
  height: 100%;
  background: linear-gradient(to right, #4CAF50 0%, #4CAF50 70%, transparent 70%);
  transition: width 0.5s ease-in-out;
}

`


export default ProgressTemplate;