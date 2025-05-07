import React, { useState, useEffect } from 'react';
import { FaCode, FaTerminal } from 'react-icons/fa';
import '../../../../scss/Pages/Progressive.scss';
import HeaderComponent from '../../../Components/Game/HeaderComponent';
import EditorArea from '../../../Components/Game/EditorArea';
import Sidebar from '../../../Components/Game/Sidebar';
import { ThemeProvider } from '../../../context/ThemeContext';

// Mock data for the UI
const problemsList = [
  { id: 1, title: 'Two Sum', difficulty: 'easy', category: 'Array' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'easy', category: 'Stack' },
  { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'easy', category: 'Linked List' },
  { id: 4, title: 'Add Two Numbers', difficulty: 'medium', category: 'Linked List' },
  { id: 5, title: 'LRU Cache', difficulty: 'medium', category: 'Design' },
  { id: 6, title: 'Binary Tree Level Order Traversal', difficulty: 'medium', category: 'Tree' },
  { id: 7, title: 'Trapping Rain Water', difficulty: 'hard', category: 'Array' },
  { id: 8, title: 'Median of Two Sorted Arrays', difficulty: 'hard', category: 'Array' },
];

const problemData = {
  instruction: `Write a function that takes two numbers as input and returns their sum.

Your function should handle both positive and negative integers, as well as zero.

The numbers will be in the range of -10^9 to 10^9.

Return the sum of the two numbers.`,
  testCase: `Example 1:
Input: a = 0, b = 0
Expected Output: 0
Explanation: 0 + 0 = 0

Example 2:
Input: a = -2, b = 10
Expected Output: 8
Explanation: -2 + 10 = 8

Example 3:
Input: a = 5, b = 3
Expected Output: 8`,
  expectedOutput: `<div class="test-cases">
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 3</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">5 + 3 = 8</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 2</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">-2 + 10 = 8</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 1</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">0 + 0 = 0</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 4</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">100 + 200 = 300</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 5</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">-50 + 50 = 0</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 6</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">999 + 1 = 1000</div>
  </div>
  
  <div class="test-case">
    <div class="test-header">
      <div class="test-id">Test 7</div>
      <div class="checkbox">☐</div>
    </div>
    <div class="test-content">-25 + (-25) = -50</div>
  </div>
</div>`
};

// Mock editor content for display
const sampleCode = `function sum(a, b) {
  return a + b;
}

// Example usage
console.log(sum(5, 3));  // Output: 8`;

const fontFamilies = [
  { label: 'Fira Mono', value: 'Fira Mono, monospace' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
  { label: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { label: 'Monaco', value: 'Monaco, monospace' },
  { label: 'Consolas', value: 'Consolas, monospace' },
];

// Main Component
const Progressive = () => {
  // State management
  const [fontSize, setFontSize] = useState('16px');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [problemExpanded, setProblemExpanded] = useState(true);
  const [instructionsExpanded, setInstructionsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('instruction');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(10);
  const [codeValue, setCodeValue] = useState(sampleCode);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const maxExp = 20; // exp needed for next level

  // Simulate run code with better output formatting
  const runCode = () => {
    setLoading(true);
    setTerminalOutput('');
    setTerminalOpen(true);
    
    setTimeout(() => {
      const results = [
        '> Running test cases...',
        '✓ Test case 1: [2,7,11,15], target = 9 => [0,1]',
        '✓ Test case 2: [3,2,4], target = 6 => [1,2]',
        '✓ Test case 3: [3,3], target = 6 => [0,1]',
        '',
        '3/3 tests passed',
        '> Time complexity: O(n)',
        '> Space complexity: O(n)',
        '',
        '✓ All tests passed!'
      ].join('\n');
      
      setTerminalOutput(results);
      setLoading(false);
    }, 1500);
  };

  // Terminal Modal Component
  const TerminalModal = () => {
    if (!terminalOpen) return null;
    
    return (
      <div className="terminal-modal-overlay">
        <div className={`terminal-modal ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="terminal-header">
            <h3>Terminal Output</h3>
            <button onClick={() => setTerminalOpen(false)} className="close-btn">×</button>
          </div>
          <div className="terminal-content">
            {loading ? (
              <div className="loading-indicator">Running code...</div>
            ) : (
              <pre>{terminalOutput}</pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <div className="progressive">
        <HeaderComponent 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontFamilies={fontFamilies}
          level={level}
          exp={exp}
          maxExp={maxExp}
        />

        <div className="content-wrapper">
          <EditorArea 
            fontSize={fontSize}
            fontFamily={fontFamily}
            isDarkMode={isDarkMode}
            codeValue={codeValue}
            onCodeChange={setCodeValue}
          />

          <Sidebar 
            problemExpanded={problemExpanded}
            setProblemExpanded={setProblemExpanded}
            problems={problemsList}
            selectedProblem={selectedProblem}
            setSelectedProblem={setSelectedProblem}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            instructionsExpanded={instructionsExpanded}
            setInstructionsExpanded={setInstructionsExpanded}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            problemData={problemData}
            runCode={runCode}
          />
        </div>

        {/* Run Code Button */}
        <div className="run-code-button-container">
          <button 
            className={`run-code-button ${loading ? 'loading' : ''}`} 
            onClick={runCode}
            disabled={loading}
          >
            {loading ? 'Running...' : (
              <>
                <FaTerminal /> Run in terminal
              </>
            )}
          </button>
        </div>

        {/* Terminal Modal */}
        <TerminalModal />
      </div>
    </ThemeProvider>
  );
};

export default Progressive;