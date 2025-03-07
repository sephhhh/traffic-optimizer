import React from "react";
import styled from "styled-components";

const TrafficLight = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader-circle" />
        <div className="loader-circle" />
        <div className="loader-circle" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    width: 70px;
    height: 190px;
    background-image: linear-gradient(
      to right bottom,
      #000000,
      #141414,
      #202020,
      #2d2d2d,
      #3a3a3a
    );
    border: 5px solid black;
    border-radius: 18px;
    position: relative;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 5px 0;
  }

  .loader:after {
    content: "";
    position: absolute;
    top: 100%;
    right: 50%;
    transform: translate(50%, -50%);
    width: 10px;
    height: 200px;
    background-color: rgb(20, 20, 20);
    z-index: -1;
    border: 5px solid black;
  }

  .loader-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: relative;
  }

  .loader-circle::after {
    position: absolute;
    content: "";
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    height: 80%;
    width: 80%;
    background-image: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.5)
    );
    border-radius: 50%;
  }

  .loader-circle:nth-child(1) {
    background-color: red;
    animation: changeGrayscale 1s linear infinite;
    animation-delay: 0.15s;
  }

  .loader-circle:nth-child(2) {
    background-color: rgb(255, 200, 0);
    animation: changeGrayscale 1s linear infinite;
    animation-delay: 0.3s;
  }

  .loader-circle:nth-child(3) {
    background-color: rgb(36, 182, 0);
    animation: changeGrayscale 1s linear infinite;
    animation-delay: 0.45s;
  }

  @keyframes changeGrayscale {
    0%,
    100% {
      filter: brightness(0);
      /* En grayscale al principio y al final */
    }

    50% {
      filter: grayscale(0);
      /* Sin grayscale en la mitad de la animación */
    }
  }
`;

export default TrafficLight;
