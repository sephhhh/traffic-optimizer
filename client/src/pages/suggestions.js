import React from 'react';
import { useNavigate, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import Back from '../icons/back.svg';
import SimpleTable from './table';


function Suggestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const csvData = location.state?.csvData || [];

  const backBtnAction = () => {
    navigate('/inputFiles');
  }

  console.log('Received CSV Data:', csvData);

  return (
    <div className='flex flex-col justify-center'>
      <div className="flex relative justify-center items-center w-[93%]">
        <button class="absolute left-0 p-0 box-border border-transparent bg-transparent mt-5 flex items-center" onClick={backBtnAction}> <img src={Back} id='backImg'/></button>
        <div className='headerText'>Here are your results</div>
      </div>
      <div className='flex justify-center items-center'>
        <SimpleTable />
      </div>
    </div>
  );
}

export default Suggestions;
