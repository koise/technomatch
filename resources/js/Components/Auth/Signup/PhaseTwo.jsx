import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSignup } from '@/context/SignupContext';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  // Countdown logic
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

  const handleSendEmail = () => {
    setEmailSent(true);
    setResending(true);
    setCountdown(30); 
  };

  const handleResendEmail = () => {
    if (countdown === 0) {
      setResending(true);
      setCountdown(30); 
    }
  };

  const onSubmit = (data) => {
    console.log('Verifying code with data:', data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form phase-two">
      <div className="verification-info mb-4 text-sm text-gray-600">
        <p>
          We've sent a verification code to <strong>{formData.email}</strong>.
        </p>
        <p>Please check your inbox and enter the code below to continue.</p>
      </div>

      {/* Email Field */}
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
          disabled={emailSent && countdown > 0} // Disable when email is sent and countdown is not 0
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

      {/* Email Buttons */}
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
            Don’t see the email? Check your spam folder or{' '}
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
                backgroundColor: countdown > 0 ? '#515052' : '#ff312e', // Tailwind gray-200 / blue-600
                color: countdown > 0 ? '#6b7280' : '#fff', // Tailwind gray-500 / white
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
          type="button"
          className="btn-back"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </motion.button>

        <motion.button
          type="submit"
          className="btn-submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Verify & Continue
        </motion.button>
      </div>
    </form>
  );
}
