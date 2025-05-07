import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Info, Code, CheckSquare } from 'lucide-react';

const Instructions = () => {
  const [activeTab, setActiveTab] = useState('instruction');
  const [expanded, setExpanded] = useState(true);
  
  // Sample data
  const problemData = {
    instruction: `
      Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
      
      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      
      You can return the answer in any order.
    `,
    testCase: `
      Example 1:
      Input: nums = [2,7,11,15], target = 9
      Output: [0,1]
      Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
      
      Example 2:
      Input: nums = [3,2,4], target = 6
      Output: [1,2]
      
      Example 3:
      Input: nums = [3,3], target = 6
      Output: [0,1]
    `,
    expectedOutput: `
      Constraints:
      - 2 <= nums.length <= 104
      - -109 <= nums[i] <= 109
      - -109 <= target <= 109
      - Only one valid answer exists.
      
      Follow-up: Can you come up with an algorithm that is less than O(n²) time complexity?
    `
  };
  
  // Tab configuration with icons
  const tabs = [
    { id: 'instruction', label: 'Instruction', icon: <Info size={16} /> },
    { id: 'testCase', label: 'Test Cases', icon: <Code size={16} /> },
    { id: 'expectedOutput', label: 'Constraints', icon: <CheckSquare size={16} /> }
  ];
  
  return (
    <motion.div 
      className="instructions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div 
        className="section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h2>Problem Details</h2>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tab-navigation">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-selected={activeTab === tab.id}
                >
                  {tab.icon}
                  <span style={{ marginLeft: 'var(--spacing-2)' }}>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <motion.div 
              className="tab-content"
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <pre>{problemData[activeTab]}</pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Instructions;