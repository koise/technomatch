import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProblemBank = ({ 
  problemExpanded, 
  setProblemExpanded,
  problems,
  selectedProblem,
  setSelectedProblem,
  searchQuery,
  setSearchQuery,
  difficultyFilter, 
  setDifficultyFilter,
  categoryFilter,
  setCategoryFilter
}) => {
  // Get unique categories
  const categories = ['all', ...new Set(problems.map(p => p.category))];

  // Filter problems by difficulty, category and search
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      layout
      className="card problem-bank"
    >
      <div 
        className="card-header"
        onClick={() => setProblemExpanded(!problemExpanded)}
      >
        <h2>Problem Bank</h2>
        <motion.div
          animate={{ rotate: problemExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      <AnimatePresence>
        {problemExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="problem-list">
              {filteredProblems.map((problem, index) => (
                <motion.div 
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`problem-item ${selectedProblem === index ? 'selected' : ''}`}
                  onClick={() => setSelectedProblem(index)}
                >
                  <div className="problem-info">
                    <span className="title">{problem.title}</span>
                    <span className="category">{problem.category}</span>
                  </div>
                  <span className={`difficulty ${problem.difficulty}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </motion.div>
              ))}

              {filteredProblems.length === 0 && (
                <div className="empty-state">
                  No problems match the selected filters.
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