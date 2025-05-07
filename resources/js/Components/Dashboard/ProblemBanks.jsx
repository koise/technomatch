import React, { useState, useEffect } from 'react';
import '../../../scss/Components/Dashboard/ProblemBanks.scss';

const problems = [
  // TechnoClash Problems
  {
    id: 1,
    title: 'Neural Network From Scratch',
    difficulty: 'TechnoClash',
    tags: ['Machine Learning', 'Math', 'Optimization'],
    description: 'Build a neural network implementation including backpropagation.'
  },
  {
    id: 2,
    title: 'Distributed Blockchain Consensus',
    difficulty: 'TechnoClash',
    tags: ['Blockchain', 'Consensus Algorithms', 'Distributed Systems'],
    description: 'Implement a consensus algorithm for a distributed blockchain network.'
  },
  {
    id: 3,
    title: 'Real-time Raytracing Engine',
    difficulty: 'TechnoClash',
    tags: ['Graphics', 'Optimization', 'Physics'],
    description: 'Develop a real-time raytracing engine for complex 3D scenes.'
  },
  {
    id: 4,
    title: 'Genetic Algorithm Optimizer',
    difficulty: 'TechnoClash',
    tags: ['Genetic Algorithms', 'Optimization', 'Heuristics'],
    description: 'Create a genetic algorithm framework to solve complex optimization problems.'
  },
  {
    id: 5,
    title: 'Quantum Computing Simulator',
    difficulty: 'TechnoClash',
    tags: ['Quantum', 'Simulation', 'Complex Algorithms'],
    description: 'Build a simulator for quantum computing operations and algorithms.'
  },

  // Easy Problems
  {
    id: 6,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'HashMap'],
    description: 'Find two numbers that add up to a specific target.'
  },
  {
    id: 7,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    description: 'Determine if the input string has valid parentheses ordering.'
  },
  {
    id: 8,
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    description: 'Merge two sorted linked lists into one sorted list.'
  },
  {
    id: 9,
    title: 'Maximum Subarray',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    description: 'Find the contiguous subarray with the largest sum.'
  },
  {
    id: 10,
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List'],
    description: 'Reverse a singly linked list.'
  },

  // Medium Problems
  {
    id: 11,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window', 'HashMap'],
    description: 'Find the length of the longest substring without repeating characters.'
  },
  {
    id: 12,
    title: '3Sum',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'],
    description: 'Find all unique triplets that sum up to zero.'
  },
  {
    id: 13,
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'BFS'],
    description: 'Return the level order traversal of a binary tree\'s values.'
  },
  {
    id: 14,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers'],
    description: 'Find two lines that together with the x-axis form a container that holds the most water.'
  },
  {
    id: 15,
    title: 'Course Schedule',
    difficulty: 'Medium',
    tags: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
    description: 'Determine if it\'s possible to finish all courses given prerequisites.'
  },
  {
    id: 21,
    title: 'Domino and Tromino Tiling',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Math'],
    description: 'Count how many ways to tile a 2 x n board with dominoes and trominoes.'
  },
  {
    id: 22,
    title: 'Integer to Roman',
    difficulty: 'Medium',
    tags: ['Math', 'Greedy'],
    description: 'Convert an integer to a Roman numeral.'
  },
  {
    id: 23,
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    tags: ['String Manipulation'],
    description: 'Rearrange a string in a zigzag pattern based on a number of rows.'
  },
  {
    id: 24,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math'],
    description: 'Add two numbers represented as linked lists.'
  },
  {
    id: 25,
    title: 'Reverse Integer',
    difficulty: 'Medium',
    tags: ['Math'],
    description: 'Reverse the digits of an integer.'
  },
  {
    id: 26,
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    tags: ['String', 'Parsing'],
    description: 'Implement the atoi function that converts a string to an integer.'
  },
  {
    id: 27,
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Expand Around Center'],
    description: 'Find the longest palindromic substring in a given string.'
  },

  // Intermediate Problems
  {
    id: 16,
    title: 'LRU Cache',
    difficulty: 'Intermediate',
    tags: ['Design', 'HashMap', 'Linked List'],
    description: 'Design and implement a Least Recently Used (LRU) cache.'
  },
  {
    id: 17,
    title: 'Word Search II',
    difficulty: 'Intermediate',
    tags: ['Backtracking', 'Trie'],
    description: 'Find all words in a board from a given dictionary using a Trie data structure.'
  },
  {
    id: 18,
    title: 'Sliding Window Maximum',
    difficulty: 'Intermediate',
    tags: ['Heap', 'Sliding Window', 'Deque'],
    description: 'Find the maximum element in each sliding window of size k.'
  },
  {
    id: 19,
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Intermediate',
    tags: ['Tree', 'Design'],
    description: 'Design an algorithm to serialize and deserialize a binary tree.'
  },
  {
    id: 20,
    title: 'Minimum Window Substring',
    difficulty: 'Intermediate',
    tags: ['String', 'Sliding Window', 'HashMap'],
    description: 'Find the minimum window substring of a string containing all characters of another string.'
  },

  // Hard Problems
  {
    id: 28,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    description: 'Find the median of two sorted arrays in logarithmic time.'
  },
  {
    id: 29,
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Recursion', 'String'],
    description: 'Implement regular expression matching with support for . and *.'
  },
  {
    id: 30,
    title: 'Text Justification',
    difficulty: 'Hard',
    tags: ['Greedy', 'String Manipulation'],
    description: 'Given an array of words and a max width, format the text to be fully justified.'
  },
  {
    id: 31,
    title: 'Scramble String',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    description: 'Determine if one string is a scrambled version of another.'
  }
];

const ProblemBanks = () => {
  const [activeFilter, setActiveFilter] = useState('Easy');
  const [displayProblems, setDisplayProblems] = useState([]);
  
  const filterOptions = ['All', 'Easy', 'Medium', 'Intermediate', 'Hard', 'TechnoClash'];
  
  // Update filtered problems when filter changes
  useEffect(() => {
    const filtered = activeFilter === 'All'
      ? problems
      : problems.filter(problem => problem.difficulty === activeFilter);
    
    // Show all problems for the selected difficulty
    setDisplayProblems(filtered);
  }, [activeFilter]);

  const handleFilterChange = (e) => {
    setActiveFilter(e.target.value);
  };
  
  return (
    <div className="problem-banks">
      <div className="problem-banks__header">
        <h2 className="problem-banks__title">Progressive Banks</h2>
        
        <div className="problem-banks__filter-container">
          <select 
            className="problem-banks__dropdown"
            value={activeFilter}
            onChange={handleFilterChange}
            aria-label="Filter problems by difficulty"
          >
            {filterOptions.map(filter => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="problem-banks__list-container">
        <div className="problem-banks__list">
          {displayProblems.length > 0 ? (
            displayProblems.map((problem) => (
              <div
                key={problem.id}
                className="problem-card"
              >
                <div className="problem-card__header">
                  <h3 className="problem-card__title">
                    {problem.title}
                  </h3>
                  <span className={`problem-card__difficulty problem-card__difficulty--${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="problem-card__description">{problem.description}</p>
                <div className="problem-card__tags">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="problem-card__tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="problem-card">
              <p className="problem-card__description">No problems found for this difficulty level.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemBanks;