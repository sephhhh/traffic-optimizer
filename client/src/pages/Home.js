// ./pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Road from '../components/road';
import Card from '../components/card';
import TrafficLight from '../components/traffic_light';
import Loader from '../components/truck';

const Home = () => {
  const navigate = useNavigate();

  const handleCSV = () => {
    navigate('/inputFiles');
  };

  const handleFormInput = () => {
    navigate('/inputForm');
  }

  return (
    <div className='flex flex-col h-screen justify-center'>
      <div className='text-[70px] text-center '>Traffic Optimizer</div>
      <div className='flex justify-center items-center gap-[50px]'>
        <Road />
      </div>
    </div>
    

  );
};

export default Home;


/*
      <div className='flex-1 flex-col flex justify-center items-center h-[100%]'>
        <Road />
      </div>*/