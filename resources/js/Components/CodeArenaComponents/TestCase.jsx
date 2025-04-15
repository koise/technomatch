// src/components/TestCase.js
import React from 'react';

const TestCase = () => {
  const testCases = [
    { id: 1, input: '5', expected: '25', description: 'Positive integer' },
    { id: 2, input: '-7', expected: '49', description: 'Negative integer' },
    { id: 3, input: '0', expected: '0', description: 'Zero' },
    { id: 4, input: '3.5', expected: '12.25', description: 'Decimal number' }
  ];

  return (
    <div className="test-case-container">
      {testCases.map(test => (
        <div className="test-case" key={test.id}>
          <div className="test-case-header">
            <div className="test-badge">Test {test.id}</div>
            <div className="test-description">{test.description}</div>
          </div>
          <div className="test-details">
            <div className="test-input">
              <span>Input:</span> {test.input}
            </div>
            <div className="test-expected">
              <span>Expected:</span> {test.expected}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCase;