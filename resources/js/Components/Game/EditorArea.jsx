import React, { useState, useEffect } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaPython, FaJava, FaCode, FaRegCopy, FaCheck, FaCog, FaSearch } from 'react-icons/fa';
import { SiC, SiJavascript, SiTypescript, SiRust, SiGo, SiSwift } from 'react-icons/si';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';
import { HiOutlineChevronDown } from 'react-icons/hi';

const EditorArea = ({ 
  fontSize = '14px', 
  fontFamily = 'Menlo, Monaco, Consolas, monospace', 
  isDarkMode = true, 
  codeValue = '',
  onCodeChange
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Update line and character count when code changes
    if (codeValue) {
      setLineCount(codeValue.split('\n').length);
      setCharCount(codeValue.length);
    } else {
      setLineCount(0);
      setCharCount(0);
    }
  }, [codeValue]);

  const languages = [
    { id: 'python', name: 'Python', icon: <FaPython className="text-blue-600" /> },
    { id: 'java', name: 'Java', icon: <FaJava className="text-orange-500" /> },
    { id: 'c', name: 'C', icon: <SiC className="text-blue-400" /> }
  ];

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '22px', '24px'];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFontSizeChange = (size) => {
    setCurrentFontSize(size);
    setShowFontSizeDropdown(false);
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns when clicking outside
      if (showLangDropdown || showFontSizeDropdown) {
        setShowLangDropdown(false);
        setShowFontSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangDropdown, showFontSizeDropdown]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`editor-area ${isFullscreen ? 'editor-fullscreen' : ''}`}
    >
      <div className="editor-container">
        {/* Editor Header */}
        <div className="editor-lang-header">
          {/* Language indicator with icon */}
          <div className="header-left">
            <div className="language-indicator">
              {languages.find(l => l.id === selectedLanguage)?.icon}
              <span className="language-name">{languages.find(l => l.id === selectedLanguage)?.name}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="header-right">
            {/* Font size selector */}
            <div className="editor-control font-size-control">
              <button 
                className="control-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFontSizeDropdown(!showFontSizeDropdown);
                  setShowLangDropdown(false);
                }}
              >
                <span className="control-text">{currentFontSize}</span>
                <HiOutlineChevronDown className={`control-icon ${showFontSizeDropdown ? 'rotated' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFontSizeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="dropdown-menu font-size-dropdown"
                  >
                    {fontSizes.map(size => (
                      <button
                        key={size}
                        className={`dropdown-item ${currentFontSize === size ? 'active' : ''}`}
                        onClick={() => handleFontSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Language selector */}
            <div className="editor-control language-control">
              <button 
                className="control-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLangDropdown(!showLangDropdown);
                  setShowFontSizeDropdown(false);
                }}
              >
                <span className="control-text">Language</span>
                <HiOutlineChevronDown className={`control-icon ${showLangDropdown ? 'rotated' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="dropdown-menu language-dropdown"
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.id}
                        className={`dropdown-item ${selectedLanguage === lang.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLanguage(lang.id);
                          setShowLangDropdown(false);
                        }}
                      >
                        <span className="item-icon">{lang.icon}</span>
                        <span className="item-text">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Action buttons */}
            <div className="action-buttons">
              <button 
                className="action-button tooltip-container" 
                onClick={copyToClipboard}
              >
                {copied ? <FaCheck className="text-green-500" /> : <FaRegCopy />}
                <span className="tooltip-text">Copy Code</span>
              </button>
              
              <button 
                className="action-button tooltip-container"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <IoMdClose /> : <CgArrowsExpandRight />}
                <span className="tooltip-text">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className="editor-content">
          <MonacoEditor
            height="100%"
            language={selectedLanguage}
            value={codeValue}
            theme={isDarkMode ? "vs-dark" : "light"}
            options={{
              fontSize: parseInt(currentFontSize),
              fontFamily,
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollbar: { 
                vertical: "auto", 
                horizontal: "auto", 
                verticalScrollbarSize: 10, 
                horizontalScrollbarSize: 10,
                useShadows: true
              },
              tabSize: 2,
              padding: { top: 10 },
              renderWhitespace: "none",
              renderControlCharacters: false,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: true,
              bracketPairColorization: { enabled: true }
            }}
            onChange={onCodeChange}
          />
        </div>
        
        {/* Status Bar */}
        <div className="editor-statusbar">
          <div className="status-left">
            <div className="status-item">
              <span>{lineCount} lines</span>
            </div>
            <div className="status-item">
              <span>{charCount} characters</span>
            </div>
          </div>
          <div className="status-right">
            <div className="status-item">
              <FaSearch className="status-icon" />
              <span>Ctrl+F to search</span>
            </div>
            <div className="status-item">
              <FaCog className="status-icon" />
              <span>{selectedLanguage}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditorArea;