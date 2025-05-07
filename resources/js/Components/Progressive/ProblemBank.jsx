import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Filter } from 'lucide-react';

const ProblemBank = () => {
  const [expanded, setExpanded] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Sample problems data
  const allProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy' },
    { id: 2, title: 'Valid Parentheses', difficulty: 'Easy' },
    { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'Easy' },
    { id: 4, title: 'Add Two Numbers', difficulty: 'Medium' },
    { id: 5, title: 'LRU Cache', difficulty: 'Medium' },
    { id: 6, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
    { id: 7, title: 'Trapping Rain Water', difficulty: 'Hard' },
    { id: 8, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
  ];
  
  // Filter problems by difficulty
  const filteredProblems = difficultyFilter === 'all' 
    ? allProblems
    : allProblems.filter(problem => problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
  
  return (
    <motion.div 
      className="problem-bank"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="section-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h2>Problem Bank</h2>
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
            <div className="difficulty-filter">
              <select 
                className="difficulty-select"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                aria-label="Filter problems by difficulty"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="problem-list">
              {filteredProblems.map((problem, index) => (
                <motion.div 
                  key={problem.id}
                  className={`problem-item ${selectedProblem === index ? 'selected' : ''}`}
                  onClick={() => setSelectedProblem(index)}
                  whileHover={{ backgroundColor: 'var(--primary-light-color)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="problem-title">{problem.title}</span>
                  <span className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </motion.div>
              ))}
              
              {filteredProblems.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--spacing-4)' }}>
                  No problems match the selected filter.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProblemBank;