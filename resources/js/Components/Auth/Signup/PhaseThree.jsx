import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSignup } from '@/context/SignupContext';
import { User, Lock, Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import axios from 'axios';

export default function PhaseThree({ onNext, onBack }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { setFormData, formData } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [usernameExists, setUsernameExists] = useState(false); // Track if the username exists

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const username = watch("username", "");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecial, isLongEnough]
      .filter(Boolean).length;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  // Check if username exists when username changes
  useEffect(() => {
    if (username) {
      axios.post('/check-username', { username })
        .then(response => {
          setUsernameExists(response.data.exists);
        })
        .catch(error => {
          console.error("Error checking username:", error);
        });
    }
  }, [username]);

  const onSubmit = async (data) => {
    if (usernameExists) {
      alert("Username already exists.");
      return;
    }
  
    // Set merged form data first
    setFormData(prev => ({ ...prev, ...data }));
  
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role || 'Student',
      username: data.username,
      password: data.password,
    };
  
    try {
      const res = await axios.post('/register', payload);
      if (res.data.success) {
        console.log(res);
        onNext();
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };
  
  
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*_(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form phase-three">
      <div className="relative w-full">
        <input 
          placeholder="Username" 
          defaultValue={formData.username}
          {...register('username', { 
            required: 'Username is required',
            minLength: { value: 3, message: 'Username must be at least 3 characters' }
          })}
          className={errors.username ? 'error' : usernameExists ? 'error-exists' : ''}
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}
        {usernameExists && (
          <p className="error-message">Username already exists.</p>
        )}
      </div>

      <div className="relative w-full">
        <div className="relative">
          <input 
            placeholder="Password" 
            type={showPassword ? "text" : "password"} 
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
            className={errors.password ? 'error' : ''}
          />
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      <div className="password-requirements">
        <h4>Password Requirements:</h4>
        <ul>
          <li className={isLongEnough ? 'valid' : ''}>
            {isLongEnough ? <Check size={14} /> : <X size={14} />}
            At least 8 characters
          </li>
          <li className={hasUpperCase ? 'valid' : ''}>
            {hasUpperCase ? <Check size={14} /> : <X size={14} />}
            One uppercase letter
          </li>
          <li className={hasLowerCase ? 'valid' : ''}>
            {hasLowerCase ? <Check size={14} /> : <X size={14} />}
            One lowercase letter
          </li>
          <li className={hasNumbers ? 'valid' : ''}>
            {hasNumbers ? <Check size={14} /> : <X size={14} />}
            One number
          </li>
          <li className={hasSpecial ? 'valid' : ''}>
            {hasSpecial ? <Check size={14} /> : <X size={14} />}
            One special character
          </li>
        </ul>
        
        {password && (
          <div className="password-strength">
            <div className={`strength-bar ${passwordStrength}`}></div>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <div className="relative">
          <input 
            placeholder="Confirm Password" 
            type={showConfirmPassword ? "text" : "password"} 
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || "Passwords do not match"
            })}
            className={errors.confirmPassword ? 'error' : ''}
          />
        </div>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <motion.button 
          type="button"
          className="btn-secondary"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            backgroundColor: 'transparent', 
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)'
          }}
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </motion.button>
        
        <motion.button 
          type="submit"
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial || password !== confirmPassword || usernameExists}
        >
          Continue
        </motion.button>
      </div>
    </form>
  );
}
