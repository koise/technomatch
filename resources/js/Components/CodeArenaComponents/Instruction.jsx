// src/components/Instruction.js
import React from 'react';

const Instruction = () => {
  return (
    <div className="instruction">
      <div className="instruction-card">
        <h3>Getting Square</h3>
        <p>
          Write a program that computes the square of a number and returns the result.
        </p>
        <div className="hints">
          <h4>Hints:</h4>
          <p>Remember that the square of a number is that number multiplied by itself.</p>
        </div>
      </div>
    </div>
  );
};

export default Instruction;