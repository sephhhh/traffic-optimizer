// ./pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/inputFiles');
  };

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <button onClick={handleClick}>go to input page</button>
    </div>
  );
};

export default Home;
