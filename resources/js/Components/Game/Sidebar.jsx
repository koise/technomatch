import React from 'react';
import { motion } from 'framer-motion';
import ProblemBank from './ProblemBank';
import ProblemDetails from './ProblemDetails';

const Sidebar = ({ 
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
  setCategoryFilter,
  instructionsExpanded,
  setInstructionsExpanded,
  activeTab,
  setActiveTab,
  problemData
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sidebar"
    >
      <div className="cards-container">
        <ProblemBank 
          problemExpanded={problemExpanded}
          setProblemExpanded={setProblemExpanded}
          problems={problems}
          selectedProblem={selectedProblem}
          setSelectedProblem={setSelectedProblem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        <ProblemDetails 
          instructionsExpanded={instructionsExpanded}
          setInstructionsExpanded={setInstructionsExpanded}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          problemData={problemData}
        />
      </div>
    </motion.div>
  );
};

export default Sidebar; 