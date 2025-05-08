import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';


const ProblemBank = () => {
  // Sample problems data
  const problems = [
    { id: 1, title: "Two Sum", difficulty: "easy" },
    { id: 2, title: "Valid Parentheses", difficulty: "easy" },
    { id: 3, title: "Merge Two Sorted Lists", difficulty: "easy" },
    { id: 4, title: "Add Two Numbers", difficulty: "medium" },
    { id: 5, title: "Longest Substring Without Repeating Characters", difficulty: "medium" },
    { id: 6, title: "Median of Two Sorted Arrays", difficulty: "hard" },
    { id: 7, title: "Regular Expression Matching", difficulty: "hard" },
    { id: 8, title: "Container With Most Water", difficulty: "medium" },
    { id: 9, title: "3Sum", difficulty: "medium" },
    { id: 10, title: "Remove Nth Node From End of List", difficulty: "medium" },
    { id: 11, title: "Valid Sudoku", difficulty: "medium" },
    { id: 12, title: "Trapping Rain Water", difficulty: "hard" },
  ];

  // State
  const [problemExpanded, setProblemExpanded] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get unique difficulties
  const difficulties = ['all', ...new Set(problems.map(p => p.difficulty))];

  // Filter problems by difficulty
  const filteredProblems = problems.filter(problem => {
    return difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
  });

  return (
    <div className={`problem-bank ${!problemExpanded ? 'collapsed' : ''}`}>
      {/* Gradient header line */}
      <div className="problem-bank__header-gradient"></div>
      
      {/* Header */}
      <div className="problem-bank__header" onClick={() => setProblemExpanded(!problemExpanded)}>
        <div className="problem-bank__header-content">
          <h2 className="problem-bank__header-title">Problem Bank</h2>
          {!problemExpanded && difficultyFilter !== 'all' && (
            <div className="problem-bank__filter-badge">
              <span>{difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}</span>
              <span className="problem-bank__filter-badge-count">({filteredProblems.length})</span>
            </div>
          )}
        </div>
        
        <div className={`problem-bank__chevron ${problemExpanded ? 'problem-bank__chevron--open' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </div>

      {problemExpanded && (
        <div className="problem-bank__content-wrapper">
          {/* Difficulty filter toolbar */}
          <div className="problem-bank__filter-bar">
            <Filter size={16} className="problem-bank__filter-bar-icon" />
            
            <div className="problem-bank__dropdown-container">
              <div
                className="problem-bank__dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <span>
                  {difficultyFilter === 'all' 
                    ? 'All Levels' 
                    : difficultyFilter.charAt(0).toUpperCase() + difficultyFilter.slice(1)}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`problem-bank__chevron ${dropdownOpen ? 'problem-bank__chevron--open' : ''}`} 
                />
              </div>
              
              {dropdownOpen && (
                <div className="problem-bank__dropdown-menu">
                  {difficulties.map(difficulty => {
                    let itemClasses = ['problem-bank__dropdown-item'];
                    
                    if (difficultyFilter === difficulty) {
                      itemClasses.push('problem-bank__dropdown-item--active');
                      
                      if (difficulty === 'easy') {
                        itemClasses.push('problem-bank__dropdown-item--easy');
                      } else if (difficulty === 'medium') {
                        itemClasses.push('problem-bank__dropdown-item--medium');
                      } else if (difficulty === 'hard') {
                        itemClasses.push('problem-bank__dropdown-item--hard');
                      }
                    }
                    
                    return (
                      <div 
                        key={difficulty} 
                        className={itemClasses.join(' ')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDifficultyFilter(difficulty);
                          setDropdownOpen(false);
                        }}
                      >
                        {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {difficultyFilter !== 'all' && (
              <div 
                className="problem-bank__clear-filter"
                onClick={(e) => {
                  e.stopPropagation();
                  setDifficultyFilter('all');
                }}
              >
                <X size={14} />
              </div>
            )}
          </div>

          {/* Problem list */}
          <div className="problem-bank__problem-list">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => {
                const isSelected = selectedProblem === index;
                
                const itemClasses = [
                  'problem-bank__problem-item',
                  isSelected ? 'problem-bank__problem-item--selected' : ''
                ];
                
                const titleClasses = [
                  'problem-bank__problem-title',
                  isSelected ? 'problem-bank__problem-title--selected' : ''
                ];
                
                const difficultyClasses = [
                  'problem-bank__difficulty',
                  `problem-bank__difficulty--${problem.difficulty}`
                ];
                
                return (
                  <div 
                    key={problem.id}
                    className={itemClasses.join(' ')}
                    onClick={() => setSelectedProblem(index)}
                  >
                    <div className="problem-bank__problem-info">
                      <span className={titleClasses.join(' ')}>
                        {problem.title}
                      </span>
                    </div>
                    
                    <span className={difficultyClasses.join(' ')}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="problem-bank__empty-state">
                No problems match the selected filters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemBank;