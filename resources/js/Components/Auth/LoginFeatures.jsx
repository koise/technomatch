import React from 'react';
import { FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

const LoginFeatures = () => {
  return (
    <div className="login-graphics">
      <div className="login-features">
        <div className="login-feature">
          <div className="feature-icon">
            <FiShield />
          </div>
          <div className="feature-content">
            <h3>Secure Platform</h3>
            <p>Advanced encryption and security measures to protect your data and privacy.</p>
          </div>
        </div>
        <div className="login-feature">
          <div className="feature-icon">
            <FiTrendingUp />
          </div>
          <div className="feature-content">
            <h3>Skill Matching</h3>
            <p>Our AI-powered algorithm matches you with the perfect tech opportunities.</p>
          </div>
        </div>
        <div className="login-feature">
          <div className="feature-icon">
            <FiUsers />
          </div>
          <div className="feature-content">
            <h3>Community</h3>
            <p>Join thousands of tech professionals in our growing community.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFeatures;