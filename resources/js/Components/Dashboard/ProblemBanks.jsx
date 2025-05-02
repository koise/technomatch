import React from 'react';

const problems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'HashMap'],
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window'],
  },
  {
    id: 3,
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Heap'],
  },
];

const difficultyColors = {
  Easy: 'text-green-500',
  Medium: 'text-yellow-500',
  Hard: 'text-red-500',
};

const ProblemBanks = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Problem Banks</h2>
      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="p-4 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {problem.title}
              </h3>
              <span className={`${difficultyColors[problem.difficulty]} font-medium`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {problem.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-[#444] text-gray-700 dark:text-gray-200 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemBanks;
