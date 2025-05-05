import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const CurrencyDisplay = ({ amount }) => {
  return (
    <div className="currency-display">
      <FiDollarSign className="currency-icon" />
      <span className="currency-amount">{amount}</span>
    </div>
  );
};

export default CurrencyDisplay;