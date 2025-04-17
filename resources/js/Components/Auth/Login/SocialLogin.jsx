import React from 'react';
import { FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const SocialLogin = () => {
  return (
    <div className="social-login">
      <button className="social-button google">
        <FcGoogle size={20} />
        <span>Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;