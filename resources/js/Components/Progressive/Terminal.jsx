import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2 } from 'lucide-react';

const Terminal = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const runCode = () => {
    setLoading(true);
    
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
      ].join('\\n');
      
      setOutput(results);
      setLoading(false);
    }, 1500);
  };
  
  const clearTerminal = () => {
    setOutput('');
  };
  
  return (
    <motion.div 
      className="terminal-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="terminal-actions">
        <button 
          className="terminal-button submit-button"
          onClick={runCode}
          disabled={loading}
        >
          <Play size={16} />
          <span>{loading ? 'Running...' : 'Submit'}</span>
        </button>
        
        <button 
          className="terminal-button clear-button"
          onClick={clearTerminal}
          disabled={!output}
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
      </div>
      
      <div className="terminal-output">
        {output ? (
          <pre>{output}</pre>
        ) : (
          <div className="empty-state">
            Submit your code to see the results
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Terminal;