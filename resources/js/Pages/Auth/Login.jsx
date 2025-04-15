import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthHeader from '../../Components/Auth/AuthHeader';
import InputField from '../../Components/Auth/InputField';
import PasswordField from '../../Components/Auth/PasswordField';
import ErrorAlert from '../../Components/Auth/ErrorAlert';
import RememberForgot from '../../Components/Auth/RememberForgot';
import AuthDivider from '../../Components/Auth/AuthDivider';
import SocialLogin from '../../Components/Auth/SocialLogin';
import SignupPrompt from '../../Components/Auth/SignupPrompt';
import LoginFeatures from '../../Components/Auth/LoginFeatures';
import Header from '../../Components/Partials/Header';
import '../../../scss/Pages/LoginPages.scss';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Login - TechnoMatch" />
      <Header />
      <div className="page-wrapper">
        <div className="login-container">
          <div className="login-card-wrapper">
            <div className="login-card">
              <AuthHeader />
              <ErrorAlert message={errors.auth} />

              <form onSubmit={handleSubmit} className="login-form">
                <InputField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="Enter your email"
                  error={errors.email}
                />

                <PasswordField
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  error={errors.password}
                />

                <RememberForgot rememberMe={rememberMe} setRememberMe={setRememberMe} />

                <button type="submit" className={`login-button ${processing ? 'loading' : ''}`} disabled={processing}>
                  {processing ? <><svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" /></svg><span>Logging in...</span></> : <span>Login</span>}
                </button>
              </form>

              <AuthDivider />
              <SocialLogin />
              <SignupPrompt />
            </div>
          </div>
          <LoginFeatures />
        </div>
      </div>
    </>
  );
}
