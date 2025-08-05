import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Component/FrontPage/Index.jsx';
import Creation from './Component/CreationPage/Creation';
import Toss from './Component/TossPage/UpperSection/Toss';
import AdminPage from './Component/AdminPage/AdminPage';
import SecondInnings from './Component/SecondInnings/SecondInnings';
import { CricProvider } from './Context/CricContext';

const App = () => {
  return (
    <CricProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creation" element={<Creation />} />
          <Route path="/toss/:id" element={<Toss />} />
          <Route path="/admin/:id" element={<AdminPage />} />
          <Route path="/second-innings" element={<SecondInnings />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </CricProvider>
  );
};

export default App;
