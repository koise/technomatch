import React, { useState, useEffect, useRef } from 'react';
import { FaPython, FaJava } from 'react-icons/fa';
import { SiC } from 'react-icons/si';

// Main component
const Progressive = () => {
    const [language, setLanguage] = useState('Python');
    const [fontSize, setFontSize] = useState(14);
    const [fontFamily, setFontFamily] = useState('Courier New');
    const [timeLeft, setTimeLeft] = useState(605);
    const [showSettings, setShowSettings] = useState(false);
    const [showTerminalModal, setShowTerminalModal] = useState(false);
    const [terminalOutput, setTerminalOutput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);
    const [showSurrenderModal, setShowSurrenderModal] = useState(false);
    const [isUserEditorLoading, setIsUserEditorLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('instruction');
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
        return () => {
            clearTimeout(userTimeout);
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
        setShowTerminalModal(true);
    
        setTimeout(() => {
            const output = "Executing code...\n\n> python solution.py\n Running test cases: \nTest Case 1: Input: 5 ✓ Passed\nOutput: 25\nExpected: 25\n\nTest Case 2: Input: -7 ✓ Passed\nOutput: 49\nExpected: 49\n\nAll tests completed successfully!";
            setTerminalOutput(output);
            setIsCompiling(false);
        }, 2000);
    };
    
    const handleSubmitCode = () => {
        setIsSubmitting(true);
        setShowTerminalModal(true);

        setTimeout(() => {
            const output = "Validating solution...\n\nRunning all test cases:\nBasic Test Case: ✓ Passed\nNegative Numbers: ✓ Passed\nZero Input: ✓ Passed\nDecimal Numbers: ✓ Passed\n\n✅ All test cases passed!\n\nSubmitting to leaderboard...\nYour solution has been submitted successfully!";
            setTerminalOutput(output);
            setIsSubmitting(false);
        }, 2500);
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
        <div className="bg-black text-white min-h-screen">
            {/* Header Bar */}
            <header className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
                <button className="text-red-500 font-bold">back</button>
                <div className="flex space-x-4">
                    <span className="text-red-500">xp</span>
                    <button className="text-red-500">settings</button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Section - Code Editor */}
                <div className="w-2/3 p-4 border-r border-gray-800">
                    <h2 className="text-center mb-2 text-gray-400">monaco editor</h2>
                    <div className="bg-gray-900 h-full border border-gray-700 rounded-md p-2">
                        {isUserEditorLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                                <p className="ml-2">Loading editor...</p>
                            </div>
                        ) : (
                            <pre className="text-gray-300 font-mono text-sm whitespace-pre overflow-auto h-full">
                                {code}
                            </pre>
                        )}
                    </div>
                </div>

                {/* Right Section - Problem Bank & Controls */}
                <div className="w-1/3 flex flex-col">
                    {/* Problem Bank Header */}
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="text-2xl font-bold text-center">problem bank</h2>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-800">
                        <button 
                            className={`px-4 py-2 ${activeTab === 'instruction' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('instruction')}
                        >
                            instruction
                        </button>
                        <button 
                            className={`px-4 py-2 ${activeTab === 'testCase' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('testCase')}
                        >
                            test case
                        </button>
                        <button 
                            className={`px-4 py-2 ${activeTab === 'yourOutput' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('yourOutput')}
                        >
                            your output
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-grow overflow-auto p-4">
                        {activeTab === 'instruction' && (
                            <div>
                                <h3 className="text-xl mb-4">instructions</h3>
                                <p className="text-gray-300 mb-2">Write the code to solve the problem.</p>
                                <p className="text-gray-300">Use the test cases to verify your solution.</p>
                            </div>
                        )}
                        {activeTab === 'testCase' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Test Cases:</h3>
                                <div className="bg-gray-800 p-3 rounded mb-3">
                                    <p className="text-sm text-gray-300">Test case 1: Test description here.</p>
                                </div>
                                <div className="bg-gray-800 p-3 rounded">
                                    <p className="text-sm text-gray-300">Test case 2: Test description here.</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'yourOutput' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Output:</h3>
                                <pre className="bg-gray-800 p-3 rounded text-sm text-gray-300 font-mono">
                                    {terminalOutput || "Run your code to see output here."}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-gray-800 flex space-x-4">
                        <button 
                            className="bg-white text-black font-bold py-2 px-4 rounded flex-1"
                            onClick={handleSubmitCode}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                        </button>
                        <button 
                            className="bg-gray-700 text-red-500 font-bold py-2 px-4 rounded"
                            onClick={handleRunCode}
                            disabled={isCompiling}
                        >
                            terminal
                        </button>
                    </div>
                </div>
            </div>

            {/* Terminal Modal */}
            {showTerminalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg w-4/5 max-w-3xl">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Terminal Output</h3>
                            <button 
                                className="text-gray-400 hover:text-white"
                                onClick={() => setShowTerminalModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            {isCompiling ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500 mr-3"></div>
                                    <p>Running your code...</p>
                                </div>
                            ) : (
                                <pre className="font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                                    {terminalOutput}
                                </pre>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-700 text-right">
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                onClick={() => setShowTerminalModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Surrender Modal */}
            {showSurrenderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div 
                        ref={surrenderModalRef}
                        className="bg-gray-800 rounded-lg w-96"
                    >
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold">Confirm Surrender</h3>
                        </div>
                        <div className="p-4">
                            <p className="mb-4">Are you sure you want to surrender? Your score will not be recorded.</p>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                                    onClick={handleCancelSurrender}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                    onClick={handleConfirmSurrender}
                                >
                                    Surrender
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Progressive;