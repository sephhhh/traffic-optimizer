// ./pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCSV = () => {
    navigate('/inputFiles');
  };

  const handleFormInput = () => {
    navigate('/inputForm');
  }

  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <button onClick={handleCSV}>go to input page</button>
      <button onClick={handleFormInput}>go to input form</button>
    </div>
  );
};

export default Home;
