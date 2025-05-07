import React, { useState } from 'react';
import Header from './Header';
import Editor from './Editor';
import ProblemBank from './ProblemBank';
import Instructions from './Instructions';
import Terminal from './Terminal';

const Layout = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState('14px');
  
  return (
    <div className="layout">
      <Header 
        selectedLanguage={selectedLanguage} 
        setSelectedLanguage={setSelectedLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <div className="content-wrapper">
        <div className="editor-area">
          <Editor 
            language={selectedLanguage}
            fontSize={fontSize}
          />
        </div>
        <div className="sidebar">
          <ProblemBank />
          <Instructions />
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Layout;