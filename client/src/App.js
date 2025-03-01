import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Default import
import InputFilesPage from './pages/InputFilesPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/inputFiles" element={<InputFilesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
