import React from 'react';
import { Link } from '@inertiajs/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import '../../../scss/Components/Partials/Header.scss';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (

    <header className="technomatch-header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-highlight">Techno</span>Match
        </Link>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <Link href="/login" className="nav-button">Login</Link>
          <Link href="/signup" className="nav-button outline">Sign Up</Link>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle" 
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {toggleTheme ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;