// src/App.jsx - CORRECTED LOGO FILENAMES
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { useTheme } from './context/ThemeContext';

// Import page components
import MarketUpdatePage from './pages/MarketUpdatePage';
import MarketCreationPage from './pages/MarketCreationPage';
import CustomProposalPage from './pages/CustomProposalPage';
import InstructionsPage from './pages/InstructionsPage';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <div className="sidebar-header">
            <a href="https://moonwell.fi" target="_blank" rel="noopener noreferrer">
              {/* VVVV THIS IS THE LINE WE ARE CHANGING VVVV */}
              <img 
                src={theme === 'light' ? '/Horizontal-Black.svg' : '/Horizontal-White.svg'} 
                alt="Moonwell Logo" 
                width="150" 
              />
            </a>
          </div>
          <nav className="navigation">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Instructions</NavLink>
            <NavLink to="/market-update" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Market Update</NavLink>
            <NavLink to="/market-creation" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Market Creation</NavLink>
            <NavLink to="/custom-proposal" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Custom Proposal</NavLink>
          </nav>

          <button onClick={toggleTheme} className="theme-toggle">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<InstructionsPage />} />
            <Route path="/market-update" element={<MarketUpdatePage />} />
            <Route path="/market-creation" element={<MarketCreationPage />} />
            <Route path="/custom-proposal" element={<CustomProposalPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;