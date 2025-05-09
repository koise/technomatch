import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
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
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import '../../../scss/Pages/LoginPages.scss';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  
  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);
  
  // Function to check if user is already authenticated
  const checkAuthentication = async () => {
    try {
      const response = await axios.get('/auth-check');
      if (response.data.authenticated) {
        window.location.href = response.data.redirect || '/dashboard';
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };
  
  // Function to verify auth status after login
  const verifyAuthAndRedirect = async () => {
    try {
      // Small delay to allow session to be established
      await new Promise(resolve => setTimeout(resolve, 300));
      const response = await axios.get('/auth-check');
      
      if (response.data.authenticated) {
        window.location.href = response.data.redirect || '/dashboard';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
  
    if (!data.email || !data.password) {
      setErrors({ auth: 'Email and password are required' });
      setProcessing(false);
      return;
    }
    
    try {
      const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
      
      const response = await axios.post('/login', {
        username_or_email: data.email,
        password: data.password,
        remember_me: rememberMe,
        _token: token, // Include the CSRF token in the request body
      }, {
        headers: {
          'X-CSRF-TOKEN': token, // Also include it in headers for redundancy
          'Accept': 'application/json',
        },
        withCredentials: true, // Enable sending cookies with the request
      });
      
      if (response.status === 200) {
        const userData = response.data;
        
        // Check if response contains a redirect URL
        if (userData.redirect) {
          // Use the redirect URL from the response
          window.location.href = userData.redirect;
        } else {
          // Fallback to dashboard
          window.location.href = '/dashboard';
        }
      }
    } catch (axiosError) {
      console.log('Login Error:', axiosError);

      if (axiosError.response) {
        console.log('Error Response:', axiosError.response.data);

        const { message, errors } = axiosError.response.data;

        if (message) {
          setErrors({ auth: message });
        } else if (errors) {
          if (errors.login) {
            setErrors({ login: errors.login });
          }
          if (errors.password) {
            setErrors({ password: errors.password });
          }
        }
      } else {
        // Log a fallback error message
        console.log('Error without response:', axiosError.message);
        setErrors({ auth: 'An error occurred. Please try again.' });
      }
      
      setProcessing(false);
    }
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
                    label="Email Address or Username"
                    type="text"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="Enter your email or username"
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
                    onChange={(e) => setData({ ...data, password: e.target.value })}
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
