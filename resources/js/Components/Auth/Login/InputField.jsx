import React from 'react';
import { FiMail, FiUser } from 'react-icons/fi';

const InputField = ({ id, label, type, value, onChange, placeholder, error }) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <FiMail className="input-icon" />;
      case 'text':
      default:
        return <FiUser className="input-icon" />;
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        {getIcon()}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;