import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Terminal = ({ 
  terminalOutput, 
  setTerminalOutput, 
  loading
}) => {
  return (
    <motion.div 
      layout
      className="card terminal"
    >
      <div className="terminal-actions">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`terminal-button submit ${loading ? 'disabled' : ''}`}
          onClick={runCode}
          disabled={loading}
        >
          <Play size={16} className="icon" />
          {loading ? 'Running...' : 'Run in terminal'}
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`terminal-button clear ${!terminalOutput ? 'disabled' : ''}`}
          onClick={() => setTerminalOutput('')}
          disabled={!terminalOutput}
        >
          <Trash2 size={16} className="icon" />
          Clear
        </motion.button>
      </div>

      <div className="terminal-output">
        <AnimatePresence mode="wait">
          {terminalOutput ? (
            <motion.pre
              key="output"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {terminalOutput}
            </motion.pre>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="empty-state"
            >
              Run your code to see the results
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Terminal; 