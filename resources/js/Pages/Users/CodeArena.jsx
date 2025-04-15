// src/components/CodeArena.js

import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '@/Components/CodeArenaComponents/CodeEditor';
import OpponentEditor from '@/Components/CodeArenaComponents/OpponentEditor';
import TestCase from '@/Components/CodeArenaComponents/TestCase';
import Instruction from '@/Components/CodeArenaComponents/Instruction';
import TerminalButton from '@/Components/CodeArenaComponents/TerminalButton';
import SubmitButton from '@/Components/CodeArenaComponents/SubmitButton';
import TerminalOutput from '@/Components/CodeArenaComponents/TerminalOutput';
import TerminalModal from '@/Components/CodeArenaComponents/TerminalModal';
import ToastReminder from '@/Components/CodeArenaComponents/ToastReminder';
import SurrenderModal from '@/Components/CodeArenaComponents/SurrenderModal';
import Select from 'react-select';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';
import '../../app.scss';

const CodeArena = () => {
    const [language, setLanguage] = useState('Python');
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('Courier New');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
    const [showSettings, setShowSettings] = useState(false);
    const [showTerminalModal, setShowTerminalModal] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('');
    const [terminalTitle, setTerminalTitle] = useState('');
    const settingsRef = useRef(null);

    const helloWorldCode = {
        Python: `def square(number):
    """
    Returns the square of a number
    """
    # Your code here
    return number * number

# Test your function
print(square(5))`,

        Java: `public class Solution {
    public static int square(int number) {
        // Your code here
        return number * number;
    }
    
    public static void main(String[] args) {
        System.out.println(square(5));
    }}`,

        C: `#include <stdio.h>

int square(int number) {
    // Your code here
    return number * number;
}

int main() {
    printf("%d\\n", square(5));
    return 0;
}`
    };

    const [code, setCode] = useState(helloWorldCode[language]);

    useEffect(() => {
        setCode(helloWorldCode[language]);
    }, [language]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleClickOutside = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            setShowSettings(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRunCode = () => {
        setTerminalTitle('Running Code');
        setTerminalOutput("Executing code...\n\n> python solution.py\nRunning test cases:\nTest Case 1: Input: 5 ✓ Passed\nOutput: 25\nExpected: 25\n\nTest Case 2: Input: -7 ✓ Passed\nOutput: 49\nExpected: 49\n\nAll tests completed successfully!");
        setShowTerminalModal(true);
    };

    const handleSubmitCode = () => {
        setTerminalTitle('Submitting Solution');
        setTerminalOutput("Validating solution...\n\nRunning all test cases:\nBasic Test Case: ✓ Passed\nNegative Numbers: ✓ Passed\nZero Input: ✓ Passed\nDecimal Numbers: ✓ Passed\n\n✅ All test cases passed!\n\nSubmitting to leaderboard...\nYour solution has been submitted successfully!\nExecution time: 0.002s\nMemory usage: 4.3MB\n\nGreat work! Your solution is correct and efficient.");
        setShowTerminalModal(true);
    };

    const handleSurrender = () => {
        setShowSurrenderModal(true); 
    };

    const confirmSurrender = () => {
        setShowSurrenderModal(false); // Close the modal
        alert('You have surrendered. Your score will not be recorded.');
        // Reset game state here (e.g., stop the timer, clear the code, etc.)
        setTimeLeft(0);
    };

    const closeTerminalModal = () => {
        setShowTerminalModal(false);
    };

    const languageOptions = [
        { value: 'Python', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaPython /> Python</div> },
        { value: 'Java', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaJava /> Java</div> },
        { value: 'C', label: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SiC /> C</div> },
    ];

    return (
        <div className="code-arena">
            <div className="arena-container">
                <div className="left-section">
                    <div className="header-bar">
                        <div className="title">
                            <span className="subtitle">TechnoMatch Easy Round</span>
                        </div>
                        <div className="timer-wrapper" ref={settingsRef}>
                            <div className="timer" onClick={() => setShowSettings(!showSettings)}>
                                <div className="timer-display">
                                    <span className="timer-icon">⏱️</span>
                                    <h2>{formatTime(timeLeft)}</h2>
                                </div>
                                <span className="gear-icon" title="Settings">⚙️</span>
                            </div>

                            {showSettings && (
                                <div className="settings-dropdown">
                                    <h3>Editor Settings</h3>
                                    <label>
                                        <span>Language:</span>
                                        <Select
                                            className="language-select"
                                            value={languageOptions.find(opt => opt.value === language)}
                                            onChange={(selected) => setLanguage(selected.value)}
                                            options={languageOptions}
                                            isSearchable={false}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: 'var(--border-radius)',
                                                    fontSize: '14px',
                                                    backgroundColor: 'var(--bg-medium)',
                                                    color: 'var(--text-light)',
                                                    borderColor: 'var(--bg-dark)',
                                                    boxShadow: 'var(--shadow-sm)',
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: 'var(--text-light)',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: 'var(--bg-darker)',
                                                    borderRadius: 'var(--border-radius)',
                                                    boxShadow: 'var(--shadow-lg)',
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isSelected ? 'var(--primary-dark)' : 'var(--bg-medium)',
                                                    color: state.isSelected ? 'var(--text-light)' : 'var(--text-muted)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--primary-color)',
                                                        color: 'var(--text-light)',
                                                    },
                                                }),
                                                dropdownIndicator: (base) => ({
                                                    ...base,
                                                    color: 'var(--text-light)',
                                                }),
                                                clearIndicator: (base) => ({
                                                    ...base,
                                                    color: 'var(--text-muted)',
                                                }),
                                            }}
                                        />
                                    </label>

                                    <label>
                                        <span>Font Size:</span>
                                        <select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
                                            <option value={12}>12px</option>
                                            <option value={14}>14px</option>
                                            <option value={16}>16px</option>
                                            <option value={18}>18px</option>
                                            <option value={20}>20px</option>
                                        </select>
                                    </label>

                                    <label>
                                        <span>Font Family:</span>
                                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                                            <option value="Courier New">Courier New</option>
                                            <option value="Consolas">Consolas</option>
                                            <option value="Monaco">Monaco</option>
                                            <option value="Roboto Mono">Roboto Mono</option>
                                        </select>
                                    </label>

                                    <button className="surrender-button" onClick={handleSurrender}>
                                        Surrender
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="editor-section">
                        <div className="editor-header">
                            <h2>User's Code</h2>
                            <div className="language-badge">
                                {language === 'Python' && <FaPython size={20} />}
                                {language === 'Java' && <FaJava size={20} />}
                                {language === 'C' && <SiC size={20} />}
                                <span>{language}</span>
                            </div>
                        </div>
                        <CodeEditor 
                            language={language} 
                            fontSize={fontSize} 
                            fontFamily={fontFamily} 
                            code={code} 
                            onChange={(newCode) => setCode(newCode)}
                        />
                    </div>
                </div>

                <div className="right-section">
                    <div className="section-container instructions-container">
                        <h2>Challenge Instructions</h2>
                        <Instruction />
                    </div>

                    <div className="section-container test-cases-container">
                        <h2>Test Cases</h2>
                        <TestCase />
                        <div className="submit-button-container">
                            <TerminalButton onClick={handleRunCode} />
                            <SubmitButton onClick={handleSubmitCode} />
                        </div>
                    </div>

                    <div className="section-container opponent-container">
                        <h2>User Opponent's Code</h2>
                        <OpponentEditor 
                            language={language} 
                            fontSize={fontSize} 
                            fontFamily={fontFamily} 
                            code={helloWorldCode[language]} 
                        />
                    </div>
                </div>
            </div>

            {showTerminalModal && (
                <TerminalModal 
                    title={terminalTitle}
                    output={terminalOutput}
                    onClose={closeTerminalModal}
                />
            )}

            <ToastReminder minutesLeft={Math.floor(timeLeft / 60)} />
        </div>
    );
};

export default CodeArena;
