// ./pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { animated_modal } from '../components/ui/animated-modal';


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
      < animated_modal />
      <h1 style={{textAlign: "center"}}>Traffic Optimizer</h1>
      <button class="text-blue-500" onClick={handleCSV}>go to input page</button>
      <button onClick={handleFormInput}>go to input form</button>
    </div>
  );
};

export default Home;
