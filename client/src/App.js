import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Default import
import InputFilesPage from './pages/InputFilesPage';
import InputForm from './pages/InputForm';
import Suggestions from './pages/suggestions';
import './style-sheets/App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/inputFiles" element={<InputFilesPage />} />
          <Route path="/inputForm" element={<InputForm />} />
          <Route path='/suggestions' element={<Suggestions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
