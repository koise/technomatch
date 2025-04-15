import { Link } from '@inertiajs/react';

export default function RememberForgot({ rememberMe, setRememberMe }) {
  return (
    <div className="form-options">
      <div className="remember-me">
        <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
        <label htmlFor="remember">Remember me</label>
      </div>
      <Link href="/forgot-password" className="forgot-password">Forgot Password?</Link>
    </div>
  );
}
