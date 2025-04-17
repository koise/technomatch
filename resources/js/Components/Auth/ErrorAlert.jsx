import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="error-alert">
      <FiAlertCircle />
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;