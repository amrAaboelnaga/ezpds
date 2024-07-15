import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import LandingPage from '../pages/LandingPage';
import FAQ from '../pages/FAQ';
import About from '../pages/About';
import Demo from '../pages/Demo';
import Market from '../pages/Market';
import SingleProductPage from '../pages/SingleProductPage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<SingleProductPage />} />
          {/* Add more routes as needed */}
        </Route >
      </Routes>
    </Router>
  );
};

export default AppRoutes;
