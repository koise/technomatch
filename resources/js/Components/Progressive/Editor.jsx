import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

// Monaco Editor component
const Editor = ({ language, fontSize }) => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState('// Type your code here...');
  const [editor, setEditor] = useState(null);
  
  useEffect(() => {
    // Monaco Editor setup
    if (typeof window !== 'undefined') {
      // Dynamic import for Monaco Editor
      import('monaco-editor').then(monaco => {
        // Clean up previous instance if exists
        if (editor) {
          editor.dispose();
        }
        
        const editorInstance = monaco.editor.create(document.getElementById('monaco-editor-container'), {
          value: code,
          language: language,
          theme: darkMode ? 'vs-dark' : 'vs',
          automaticLayout: true,
          minimap: { enabled: true },
          fontSize: parseInt(fontSize),
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 10 }
        });
        
        // Update code state when content changes
        editorInstance.onDidChangeModelContent(() => {
          setCode(editorInstance.getValue());
        });
        
        setEditor(editorInstance);
        
        return () => editorInstance.dispose();
      });
    }
  }, [language, darkMode, fontSize]);
  
  // Update editor theme when dark mode changes
  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        theme: darkMode ? 'vs-dark' : 'vs',
        fontSize: parseInt(fontSize)
      });
    }
  }, [editor, darkMode, fontSize]);
  
  return (
    <motion.div 
      className="editor-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div id="monaco-editor-container" className="monaco-editor"></div>
    </motion.div>
  );
};

export default Editor;