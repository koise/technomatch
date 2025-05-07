import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSignup } from '@/context/SignupContext';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../../../scss/Components/Partials/modalAndToast.scss';
import axios from 'axios';

export default function PhaseTwo({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { formData, setFormData } = useSignup();
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResending(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Auto-send verification code when component mounts if email is provided
  useEffect(() => {
    if (formData.email && !emailSent) {
      handleSendEmail();
    }
  }, []);

  const handleSendEmail = async () => {
    try {
      setResending(true);
      
      const response = await axios.post('/send-verification-code', { 
        email: formData.email 
      });
      
      if (response.data.sent) {
        setEmailSent(true);
        setCountdown(30);
        toast.success('Verification code sent successfully!', {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      let errorMessage = 'Failed to send verification code.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
      });
      setResending(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown === 0) {
      await handleSendEmail();
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsVerifying(true);
      
      const response = await axios.post('/verify-code', {
        email: formData.email,
        code: data.verificationCode
      });
      
      if (response.data.verified) {
        toast.success('Email verified successfully!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
        });
        
        setFormData(prev => ({ 
          ...prev, 
          emailVerified: true,
          verificationCode: data.verificationCode
        }));
        
        setTimeout(() => {
          onNext();
        }, 1000);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      let errorMessage = 'Failed to verify code.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form phase-two">
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="verification-info mb-4 text-sm text-gray-600">
        <p>
          We've sent a verification code to <strong>{formData.email}</strong>.
        </p>
        <p>Please check your inbox and enter the code below to continue.</p>
      </div>

      <div className="relative w-full mt-4">
        <input
          placeholder="Email"
          type="email"
          value={formData.email || ''}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Please enter a valid email',
            },
          })}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`input-field ${errors.email ? 'input-error' : ''}`}
          disabled={emailSent && countdown > 0}
        />
        {errors.email && (
          <p className="error-message text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Verification Code Field */}
      {emailSent && (
        <div className="relative w-full mt-4">
          <input
            placeholder="Verification Code"
            {...register('verificationCode', {
              required: 'Verification code is required',
              minLength: {
                value: 6,
                message: 'Code must be 6 characters',
              },
              maxLength: {
                value: 6,
                message: 'Code must be 6 characters',
              },
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Code must contain 6 digits',
              },
            })}
            className={`input-field ${errors.verificationCode ? 'input-error' : ''}`}
          />
          {errors.verificationCode && (
            <p className="error-message text-red-500 text-sm mt-1">
              {errors.verificationCode.message}
            </p>
          )}
        </div>
      )}

      <div className="email-actions mt-6 space-y-2 text-sm">
        {!emailSent && (
          <motion.button
            type="button"
            className="send-btn"
            onClick={handleSendEmail}
            disabled={resending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {resending ? (
              <>
                <RefreshCw size={14} className="inline-block mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={14} className="inline-block mr-1" />
                Send Verification Email
              </>
            )}
          </motion.button>
        )}

        {emailSent && (
          <>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#666',
                textAlign: 'center',
                marginTop: '1.5rem',
                lineHeight: '1.6',
              }}
            >
              Don't see the email? Check your spam folder or{' '}
              <motion.button
                type="button"
                onClick={handleResendEmail}
                disabled={countdown > 0}
                whileHover={{ scale: countdown > 0 ? 1 : 1.05 }}
                whileTap={{ scale: countdown > 0 ? 1 : 0.95 }}
                className={`resend-btn inline-block ml-1 px-3 py-1.5 rounded-md transition-all font-medium text-sm ${
                  countdown > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
                style={{
                  pointerEvents: countdown > 0 ? 'none' : 'auto',
                  opacity: countdown > 0 ? 0.6 : 1,
                  backgroundColor: countdown > 0 ? '#515052' : '#ff312e', 
                  color: countdown > 0 ? '#6b7280' : '#fff',
                }}
              >
                {resending ? (
                  <>
                    <RefreshCw size={14} className="inline-block mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Email'
                )}
              </motion.button>
            </p>

            {countdown > 0 && (
              <p className="text-xs text-gray-500 mt-1"
                style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  textAlign: 'center',
                  marginTop: '1.5rem',
                  lineHeight: '1.6',
                }}>
                Please wait <strong>{countdown}</strong> second{countdown !== 1 && 's'} to resend.
              </p>
            )}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">

        <motion.button
          type="submit"
          className="btn-submit"
          disabled={!emailSent || isVerifying}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isVerifying ? (
            <>
              <RefreshCw size={16} className="inline-block mr-1 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </motion.button>
      </div>
    </form>
  );
}