import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loader from './truck';

const Card = () => {
  const navigate = useNavigate();

  const handleCSV = () => {
    navigate('/inputFiles');
  };

  const handleFormInput = () => {
    navigate('/inputForm');
  }

  return (
    <StyledWrapper>
        <div className="card">
          <div className="shadow flex">
            <button class="text-[#fff] flex-1 bg-[#4dae47]" onClick={handleCSV}>IMPORT CSV</button>
            <button class="text-[#fff] flex-1 bg-[#fc7d7d]" onClick={handleFormInput}>CREATE CSV</button>
          </div>
        </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 80vw;
    height: 350px;
    background: #353535;
    transform-style: preserve-3d;
    transform: perspective(30rem) rotateX(30deg);
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .card::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(
      90deg,
      #fff 0%,
      #fff 70%,
      #353535 70%,
      #353535 100%
    );
    background-size: 120px;
    animation: animateRoad 0.5s linear infinite;
  }
  @keyframes animateRoad {
    0% {
      background-position: 0px;
    }
    100% {
      background-position: -120px;
    }
  }

  .card::after {
    content: "";
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: -20px;
    background-color: #272727;
    transform-origin: top;
    transform: perspective(30rem) rotateX(-30deg);
    box-shadow: 0 10px 20px -2px #272727;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .shadow {
    color: #fff;
    letter-spacing: 1px;
    height: 75px
  }`;

export default Card;
