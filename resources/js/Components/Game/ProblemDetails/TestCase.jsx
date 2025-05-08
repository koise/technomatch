
// TestCase.jsx
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const TestCase = ({ label, content, index, checked }) => {
  return (
    <motion.div 
      className="test-case"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ width: '100%', margin: 0 }}
    >
      <div className="test-header">
        <div className="test-id">{label}</div>
        <div className={`checkbox ${checked ? 'checked' : ''}`}>
          {checked ? <Check size={14} /> : '☐'}
        </div>
      </div>
      <div className="test-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</div>
    </motion.div>
  );
};

export default TestCase;