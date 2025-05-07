import React, { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { FaCode } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderComponent = ({ 
  isDarkMode, 
  setIsDarkMode, 
  fontSize, 
  setFontSize,
  fontFamily,
  setFontFamily,
  fontFamilies,
  level,
  exp,
  maxExp,
  onBack = () => window.history.back()
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const settingsRef = useRef();
  const modalRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (showSettings && settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
      if (showConfirmModal && modalRef.current && !modalRef.current.contains(e.target)) {
        setShowConfirmModal(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings, showConfirmModal]);

  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmBack = () => {
    setShowConfirmModal(false);
    onBack();
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="header"
    >
      <div className="header-content">
        <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBackClick}
            style={{
              background: 'rgba(var(--primary-color-rgb), 0.15)',
              border: 'none',
              cursor: 'pointer',
              marginRight: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(var(--primary-color-rgb), 0.3)'
            }}
            aria-label="Go back"
          >
            <IoArrowBack size={18} />
          </motion.button>
          <FaCode className="logo" />
          <span className="title">TechnoMatch</span>
        </div>
        
        {/* Experience display */}
        <div className="experience-display" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(30,32,40,0.5)',
          borderRadius: '1.25rem',
          padding: '0.5rem 1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: '#fff'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              width: '1.8rem',
              height: '1.8rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(var(--primary-color-rgb), 0.5)'
            }}>
              <span>{level}</span>
            </div>
            <span>Level</span>
          </div>

          <div style={{ 
            width: '10rem',
            position: 'relative' 
          }}>
            <div style={{
              height: '0.6rem',
              width: '100%',
              background: 'rgba(30,30,40,0.6)',
              borderRadius: '0.3rem',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(exp / maxExp) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                  borderRadius: '0.3rem'
                }}
              />
            </div>
            <span style={{
              position: 'absolute',
              top: '-1.2rem',
              right: 0,
              fontSize: '0.75rem',
              color: '#fff',
              opacity: 0.9
            }}>
              {exp}/{maxExp} XP
            </span>
          </div>
        </div>
        
        <div className="header-actions" style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="settings-toggle"
            onClick={() => setShowSettings(v => !v)}
            aria-label="Settings"
          >
            <Settings size={22} />
          </motion.button>
          {showSettings && (
            <motion.div
              ref={settingsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="settings-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '2.5rem',
                minWidth: '220px',
                background: 'rgba(30,32,40,0.98)',
                borderRadius: '1rem',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                padding: '1.25rem',
                zIndex: 100,
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ fontSize: '0.95em', fontWeight: 500 }}>Font Size</label>
                <input
                  type="range"
                  min={12}
                  max={24}
                  value={parseInt(fontSize)}
                  onChange={e => setFontSize(e.target.value + 'px')}
                  style={{ width: '100%' }}
                />
                <span style={{ float: 'right', fontSize: '0.9em' }}>{fontSize}</span>
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ fontSize: '0.95em', fontWeight: 500 }}>Font Family</label>
                <select
                  value={fontFamily}
                  onChange={e => setFontFamily(e.target.value)}
                  style={{ width: '100%', marginTop: '0.3em', borderRadius: '0.5em', padding: '0.3em' }}
                >
                  {fontFamilies.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}>
                <label style={{ fontSize: '0.95em', fontWeight: 500 }}>Dark Mode</label>
                <button
                  onClick={() => setIsDarkMode(v => !v)}
                  style={{
                    marginLeft: 'auto',
                    background: isDarkMode ? '#222' : '#eee',
                    border: 'none',
                    borderRadius: '1em',
                    width: '2.2em',
                    height: '1.2em',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.2s'
                  }}
                  aria-label="Toggle dark mode"
                >
                  <span style={{
                    display: 'block',
                    width: '1em',
                    height: '1em',
                    borderRadius: '50%',
                    background: isDarkMode ? '#ffd600' : '#222',
                    position: 'absolute',
                    left: isDarkMode ? '1em' : '0.2em',
                    top: '0.1em',
                    transition: 'left 0.2s, background 0.2s'
                  }} />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  style={{
                    background: isDarkMode ? 'rgba(30,32,40,0.98)' : '#fff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    width: '300px',
                    maxWidth: '90%',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <h3 style={{ 
                    margin: '0 0 1rem 0',
                    color: isDarkMode ? '#fff' : '#333'
                  }}>
                    Confirm Navigation
                  </h3>
                  <p style={{ 
                    margin: '0 0 1.5rem 0',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : '#555'
                  }}>
                    Are you sure you want to go back? Any unsaved progress may be lost.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmModal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#eee',
                        color: isDarkMode ? '#fff' : '#333',
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirmBack}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(var(--primary-color-rgb), 0.3)'
                      }}
                    >
                      Go Back
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default HeaderComponent; 