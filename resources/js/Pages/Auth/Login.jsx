import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthHeader from '../../Components/Auth/Login/AuthHeader';
import InputField from '../../Components/Auth/Login/InputField';
import PasswordField from '../../Components/Auth/Login/PasswordField';
import ErrorAlert from '../../Components/Auth/Login/ErrorAlert';
import RememberForgot from '../../Components/Auth/Login/RememberForgot';
import AuthDivider from '../../Components/Auth/Login/AuthDivider';
import SocialLogin from '../../Components/Auth/Login/SocialLogin';
import SignupPrompt from '../../Components/Auth/Login/SignupPrompt';
import LoginFeatures from '../../Components/Auth/Login/LoginFeatures';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from '@/Components/Partials/LoginHeader';   
import '../../../scss/Pages/LoginPages.scss';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <ThemeProvider>
      <Head title="Login - TechnoMatch" />
      <Header />
      <motion.div
        className="page-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="login-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="login-card-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="login-card"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <AuthHeader />
              {errors.auth && <ErrorAlert message={errors.auth} />}

              <form onSubmit={handleSubmit} className="login-form">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <InputField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Enter your email"
                    error={errors.email}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <PasswordField
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <RememberForgot rememberMe={rememberMe} setRememberMe={setRememberMe} />
                </motion.div>

                <motion.button
                  type="submit"
                  className={`login-button ${processing ? 'loading' : ''}`}
                  disabled={processing}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {processing ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" />
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <AuthDivider />
                <SocialLogin />
                <SignupPrompt />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <LoginFeatures />
          </motion.div>
        </motion.div>
      </motion.div>
    </ThemeProvider>
  );
}
