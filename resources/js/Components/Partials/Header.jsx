import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { FiSun, FiMoon } from 'react-icons/fi';
import '../../../scss/Components/Partials/Header.scss';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <header className="technomatch-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-highlight"></span>TechnoMatch
        </Link>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="#explore" className="nav-link">Features</a>
          <a href="#leaderboard" className="nav-link">Leaderboard</a>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button outline">Sign Up</Link>
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
            {darkMode ? <FiSun size={30} /> : <FiMoon size={30} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
