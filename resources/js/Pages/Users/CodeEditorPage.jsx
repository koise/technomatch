import React, { useState } from 'react';
import Timer from '@/Components/CodeArenaComponents/Timer';
import CodeEditor from '@/Components/CodeArenaComponents/CodeEditor';
import OpponentEditor from '@/Components/CodeArenaComponents/OpponentEditor';
import TestCasePanel from '@/Components/TestCasePanel';
import InstructionPanel from '@/Components/InstructionPanel';

const CodeEditorPage = () => {
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={`code-arena ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <Timer />
            <button onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="editors">
                {/* Left side: Main Code Editor */}
                <div className="code-editor-container">
                    <InstructionPanel />
                    <CodeEditor />
                </div>               
                {/* Right side: Opponent Editor and Test Cases */}
                <div className="opponent-section">
                    <OpponentEditor />
                    <TestCasePanel />
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPage;
