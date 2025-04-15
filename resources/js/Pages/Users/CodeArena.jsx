import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '@/Components/CodeArenaComponents/CodeEditor';
import OpponentEditor from '@/Components/CodeArenaComponents/OpponentEditor';
import TestCase from '@/Components/CodeArenaComponents/TestCase';
import Instruction from '@/Components/CodeArenaComponents/Instruction';
import TerminalButton from '@/Components/CodeArenaComponents/TerminalButton';
import SubmitButton from '@/Components/CodeArenaComponents/SubmitButton';
import TerminalModal from '@/Components/CodeArenaComponents/TerminalModal';
import SurrenderModal from '@/Components/CodeArenaComponents/SurrenderModal';
import SettingsDropdown from '@/Components/CodeArenaComponents/SettingsDropdown';
import ToastReminder from '@/Components/CodeArenaComponents/ToastReminder';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';
import '../../../scss/Pages/CodeArena.scss';

const CodeArena = () => {
    const [language, setLanguage] = useState('Python');
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('Courier New');
    const [timeLeft, setTimeLeft] = useState(605);
    const [showSettings, setShowSettings] = useState(false);
    const [showTerminalModal, setShowTerminalModal] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('');
    const [terminalTitle, setTerminalTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [showSurrenderModal, setShowSurrenderModal] = useState(false);
    const [isUserEditorLoading, setIsUserEditorLoading] = useState(true);
    const [isOpponentEditorLoading, setIsOpponentEditorLoading] = useState(true);
    const settingsRef = useRef(null);
    const surrenderModalRef = useRef(null);

    const helloWorldCode = {
        Python: `def square(number):\n    # Your code here\n    return number * number\nprint(square(5))`,
        Java: `public class Solution {\n    public static int square(int number) { return number * number; }\n    public static void main(String[] args) { System.out.println(square(5)); }}`,
        C: `#include <stdio.h>\nint square(int number) { return number * number; }\nint main() { printf("%d\\n", square(5)); return 0; }`,
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

    useEffect(() => {
        const userTimeout = setTimeout(() => setIsUserEditorLoading(false), 1000);
        const opponentTimeout = setTimeout(() => setIsOpponentEditorLoading(false), 1200);
        return () => {
            clearTimeout(userTimeout);
            clearTimeout(opponentTimeout);
        };
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
        if (surrenderModalRef.current && !surrenderModalRef.current.contains(e.target)) {
            setShowSurrenderModal(false); 
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRunCode = () => {
        setIsCompiling(true);
        setTerminalTitle('Running Code');
        setShowTerminalModal(true);
    
        setTimeout(() => {
            const output = "Executing code...\n\n> python solution.py\n Running test cases: \nTest Case 1: Input: 5 ✓ Passed\nOutput: 25\nExpected: 25\n\nTest Case 2: Input: -7 ✓ Passed\nOutput: 49\nExpected: 49\n\nAll tests completed successfully!";
            setTerminalOutput(output);
            setIsCompiling(false);
        }, 2000); // Simulated delay
    };
    

    const handleSubmitCode = () => {
        setIsSubmitting(true);
        setTerminalTitle('Submitting Solution');
        setShowTerminalModal(true);

        setTimeout(() => {
            const output = "Validating solution...\n\nRunning all test cases:\nBasic Test Case: ✓ Passed\nNegative Numbers: ✓ Passed\nZero Input: ✓ Passed\nDecimal Numbers: ✓ Passed\n\n✅ All test cases passed!\n\nSubmitting to leaderboard...\nYour solution has been submitted successfully!";
            setTerminalOutput(output);
            setIsSubmitting(false);
        }, 2500); // Simulated delay
    };


    const handleSurrender = () => {
        setShowSurrenderModal(true);
    };

    const handleConfirmSurrender = () => {
        setShowSurrenderModal(false);
        alert('You have surrendered. Your score will not be recorded.');
        setTimeLeft(0);
    };

    const handleCancelSurrender = () => {
        setShowSurrenderModal(false);
    };

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

                            <SettingsDropdown
                                showSettings={showSettings}
                                setShowSettings={setShowSettings}
                                language={language}
                                setLanguage={setLanguage}
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                fontFamily={fontFamily}
                                setFontFamily={setFontFamily}
                                settingsRef={settingsRef}
                                handleSurrender={handleSurrender}
                            />
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
                        {isUserEditorLoading ? (
                            <div className="editor-loading">
                                <div className="spinner"></div>
                                <p>Loading editor...</p>
                            </div>
                        ) : (
                            <CodeEditor
                                language={language}
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                code={code}
                                onChange={(newCode) => setCode(newCode)}
                            />
                        )}
                    </div>
                </div>

                <div className="right-section">
                    <div className="section-container opponents-editor">
                        <h2>Opponent's Code</h2>
                        {isOpponentEditorLoading ? (
                            <div className="editor-loading">
                                <div className="spinner"></div>
                                <p>Fetching opponent code...</p>
                            </div>
                        ) : (
                            <OpponentEditor language={language} fontSize={fontSize} fontFamily={fontFamily} />
                        )}
                    </div>
                    <div className="section-container instructions-container">
                        <h2>Challenge Instructions</h2>
                        <Instruction />
                    </div>
                    <div className="section-container button-containers">
                        <TestCase />
                        <TerminalButton onClick={handleRunCode} loading={isCompiling} />
                        <SubmitButton onClick={handleSubmitCode} isLoading={isSubmitting} />
                    </div>
                </div>
            </div>
            <ToastReminder minutesLeft={Math.floor(timeLeft / 60)} />            
            <SurrenderModal
                ref={surrenderModalRef}
                onConfirm={handleConfirmSurrender}
                onCancel={handleCancelSurrender}
                showModal={showSurrenderModal}
            />

            <TerminalModal
                title="Terminal Output"
                output={terminalOutput}
                showModal={showTerminalModal}
                loading={isCompiling}
                onClose={() => setShowTerminalModal(false)}
            />
        </div>
    );
};

export default CodeArena;
