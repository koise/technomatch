import React from 'react';
import { Link } from '@inertiajs/react';
import { FiSun, FiMoon, FiBell, FiMessageSquare, FiUser, FiSettings } from 'react-icons/fi';
import '../../../scss/Components/Partials/HeaderLogged.scss';

const HeaderLogged = ({ user = { name: "John Doe", avatar: "/api/placeholder/40/40" } }) => {
  // UI only - no functionality implementation
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <header className="technomatch-header logged">
      <div className="header-container">
        <div className="header-left">
          <Link href="/" className="logo">
            <span className="logo-highlight">Techno</span>Match
          </Link>
          <nav className="nav-links primary">
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/matches" className="nav-link">Matches</Link>
            <Link href="/projects" className="nav-link">Projects</Link>
            <Link href="/community" className="nav-link">Community</Link>
          </nav>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <button className="icon-button" aria-label="Notifications">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
            <button className="icon-button" aria-label="Messages">
              <FiMessageSquare />
              <span className="notification-badge">5</span>
            </button>
            <button className="icon-button theme-toggle" aria-label="Toggle theme">
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          <div className="user-menu">
            <button className="user-menu-button">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="user-avatar" 
              />
              <span className="user-name">{user.name}</span>
            </button>
            <div className="user-dropdown">
              <Link href="/profile" className="dropdown-item">
                <FiUser />
                <span>Profile</span>
              </Link>
              <Link href="/settings" className="dropdown-item">
                <FiSettings />
                <span>Settings</span>
              </Link>
              <hr className="dropdown-divider" />
              <Link href="/logout" className="dropdown-item logout">
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLogged;