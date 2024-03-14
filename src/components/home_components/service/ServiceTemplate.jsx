import React from "react";
import styled from "styled-components";

const ServiceTemplates = ({ title, description, icon, iconSize }) => {
  return (
    <Servs>
      <div className="list">
        <StyledImg src={icon} alt="" size={iconSize} />
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </Servs>
  );
};


const StyledImg = styled.img`
  width: ${props => props.size || "50px"}; 
`;


const Servs = styled.div`
  margin-top: 60px;
  
  .list {
      border: 2px solid var(--text);
      padding: 40px;
      width: 100%;
      border-radius: 18px;
      height: 320px;

    .fa-code {
      font-size: 52px;
    }

    h1 {
      font-size: 30px;
      margin-top: 28px;
      margin-bottom: 14px;
    }
  }
`;
export default ServiceTemplates;

