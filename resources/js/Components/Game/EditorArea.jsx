import React, { useState } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { motion } from 'framer-motion';
import { FaPython, FaJava, FaCode } from 'react-icons/fa';
import { SiC } from 'react-icons/si';

const EditorArea = ({ 
  fontSize, 
  fontFamily, 
  isDarkMode, 
  codeValue,
  onCodeChange
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languages = [
    { id: 'python', name: 'Python', icon: <FaPython className="text-blue-600" /> },
    { id: 'java', name: 'Java', icon: <FaJava className="text-orange-500" /> },
    { id: 'c', name: 'C', icon: <SiC className="text-blue-400" /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="editor-area"
    >
      <div className="editor-container">
        <div className="editor-lang-header" style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(30,32,40,0.85)',
          borderTopLeftRadius: '1.25rem', 
          borderTopRightRadius: '1.25rem',
          padding: '0.85em 1.2em',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ fontWeight: 600, fontSize: '1.08em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            {languages.find(l => l.id === selectedLanguage)?.icon}
          </div>
          
          <div style={{ position: 'relative' }}>
            {showLangDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5em',
                  background: 'rgba(30,32,40,0.98)',
                  borderRadius: '0.75em',
                  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.5em',
                  zIndex: 50,
                  minWidth: '150px'
                }}
              >
                {languages.map(lang => (
                  <motion.button
                    key={lang.id}
                    whileHover={{ 
                      scale: 1.02, 
                      backgroundColor: 'rgba(60,64,80,0.6)' 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedLanguage(lang.id);
                      setShowLangDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7em',
                      padding: '0.6em 0.8em',
                      width: '100%',
                      textAlign: 'left',
                      background: selectedLanguage === lang.id ? 'rgba(60,64,80,0.4)' : 'transparent',
                      border: 'none',
                      borderRadius: '0.4em',
                      color: '#fff',
                      cursor: 'pointer',
                      marginBottom: '0.2em',
                      fontSize: '0.9em'
                    }}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        <div className="editor-content" style={{ fontSize }}>
          <MonacoEditor
            height="100%"
            language={selectedLanguage}
            value={codeValue}
            theme={isDarkMode ? "vs-dark" : "light"}
            options={{
              fontSize: parseInt(fontSize),
              fontFamily,
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollbar: { vertical: "auto", horizontal: "auto" },
              tabSize: 2,
            }}
            onChange={onCodeChange}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorArea; 