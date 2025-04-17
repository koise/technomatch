import React from 'react';
import { Link } from '@inertiajs/react';

const SignupPrompt = () => {
  return (
    <div className="signup-prompt">
      Don't have an account?
      <Link href="/signup" className="signup-link">
        Sign up
      </Link>
    </div>
  );
};

export default SignupPrompt;