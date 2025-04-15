import React from 'react';
import { Link } from '@inertiajs/react';
import '../../../scss/Components/Partials/Header.scss';

const Header = () => {
  return (
    <header className="technomatch-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-highlight"></span>TechnoMatch
        </Link>
        <nav className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button outline">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
