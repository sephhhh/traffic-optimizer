import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Default import
import InputFilesPage from './pages/InputFilesPage';
import InputForm from './pages/InputForm';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/inputFiles" element={<InputFilesPage />} />
          <Route path="/inputForm" element={<InputForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
