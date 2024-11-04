import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="edit-button">
        <svg className="edit-svgIcon" viewBox="0 0 448 512">
            <path d="M135.2 17.2c0-4.4 3.6-8 8-8h161.6c4.4 0 8 3.6 8 8v30.4h114.4c4.4 0 8 3.6 8 8v32c0 4.4-3.6 8-8 8H24c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h114.4V17.2zm287.6 92.8v-8h-384v8h40.4l25.6 366.6c1.4 20.4 18.4 35.4 38.8 35.4h215.2c20.4 0 37.4-15 38.8-35.4l25.6-366.6h40.4zM163.2 207c4.4 0 8 3.6 8 8v192c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8V215c0-4.4 3.6-8 8-8h16zm96 0c4.4 0 8 3.6 8 8v192c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8V215c0-4.4 3.6-8 8-8h16zm96 0c4.4 0 8 3.6 8 8v192c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8V215c0-4.4 3.6-8 8-8h16z"/>
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .edit-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
    text-decoration: none !important;
  }

  .edit-svgIcon {
    width: 17px;
    transition-duration: 0.3s;
  }

  .edit-svgIcon path {
    fill: white;
  }

  .edit-button:hover {
    width: 120px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: rgb(255, 69, 69);
    align-items: center;
  }

  .edit-button:hover .edit-svgIcon {
    width: 20px;
    transition-duration: 0.3s;
    transform: translateY(60%);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }

  .edit-button::before {
    display: none;
    content: "Eliminar";
    color: white;
    transition-duration: 0.3s;
    font-size: 2px;
  }

  .edit-button:hover::before {
    display: block;
    padding-right: 10px;
    font-size: 13px;
    opacity: 1;
    transform: translateY(0px);
    transition-duration: 0.3s;
  }`;

export default Button;
