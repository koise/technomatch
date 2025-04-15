import { Link } from '@inertiajs/react';

export default function SignupPrompt() {
  return (
    <div className="signup-prompt">
      <span>Don't have an account?</span>
      <Link href="/register" className="signup-link">Create Account</Link>
    </div>
  );
}
