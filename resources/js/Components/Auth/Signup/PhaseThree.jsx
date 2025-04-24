import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSignup } from '@/context/SignupContext';
import { User, Lock, Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../scss/Components/Auth/Signup/modalAndToast.scss';
import axios from 'axios';

export default function PhaseThree({ onNext, onBack }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isRegistering, setIsRegistering] = useState(false);
  const { setFormData, formData } = useSignup();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const usernameToastId = useRef(null);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");
  const username = watch("username", "");

  useEffect(() => {
    return () => {
      if (usernameToastId.current) {
        toast.dismiss(usernameToastId.current);
      }
    };
  }, []);

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

    const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecial, isLongEnough].filter(Boolean).length;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);


  const usernameCheckTimeout = useRef(null);
  
  useEffect(() => {
    if (usernameToastId.current) {
      toast.dismiss(usernameToastId.current);
      usernameToastId.current = null;
    }
    if (!username) {
      setUsernameExists(false);
      return;
    }

    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }
    
    usernameCheckTimeout.current = setTimeout(() => {
      axios.post('/check-username', { username })
        .then(response => {
          const exists = response.data.exists;
          setUsernameExists(exists);
          
          if (exists) {
            usernameToastId.current = toast.error("Username already exists.", {
              position: "bottom-left",
              autoClose: 3000,
              hideProgressBar: false, 
              closeOnClick: true,
              closeButton: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'username-exists-toast'
            });
          }
        })
        .catch(error => {
          console.error("Error checking username:", error);
        });
    }, 500); // Debounce for 500ms
    
    // Cleanup function
    return () => {
      if (usernameCheckTimeout.current) {
        clearTimeout(usernameCheckTimeout.current);
      }
    };
  }, [username]);
  
  const finalSubmit = async (data) => {
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role || 'Student',
      username: data.username,
      password: data.password,
    };

    try {
      setIsRegistering(true);
      const res = await axios.post('/register', payload);
      toast.success("Account created successfully!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: false,
        progress: undefined,
      });
      setTimeout(() => {
        setIsRegistering(false);
        onNext();
      }, 1500);
    } catch (err) {
      setIsRegistering(false);
      toast.error("Something went wrong during registration.", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  const onFormSubmit = (data) => {
    if (usernameExists) {
      usernameToastId.current = toast.error("Username already exists.", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'username-exists-toast'
      });
      return;
    }
    setFormData(prev => ({ ...prev, ...data }));
    setShowConfirmDialog(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmDialog(false);
    finalSubmit(watch());
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*_(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="form phase-three">
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton= {false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"  // Using dark theme for better contrast
      />

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
      </div>

      <div className="relative w-full">
        <input 
          placeholder="Password" 
          type={showPassword ? "text" : "password"} 
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          })}
          className={errors.password ? 'error' : ''}
        />
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
        <input 
          placeholder="Confirm Password" 
          type={showConfirmPassword ? "text" : "password"} 
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || "Passwords do not match"
          })}
          className={errors.confirmPassword ? 'error' : ''}
        />
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
          disabled={
            !isLongEnough ||
            !hasUpperCase ||
            !hasLowerCase ||
            !hasNumbers ||
            !hasSpecial ||
            password !== confirmPassword ||
            usernameExists
          }
        >
          Register
        </motion.button>
      </div>

      {isRegistering && (
        <motion.div
          className="registering-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
        </motion.div>
      )}

      {showConfirmDialog && (
        <motion.div
          className="confirm-dialog"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="dialog-box">
            <h3>Confirm Registration</h3>
            <p>Are you sure you want to create this account?</p>
            <div className="dialog-actions">
              <button onClick={handleConfirmNo} className="btn-secondary">No</button>
              <button onClick={handleConfirmYes} className="btn-primary">Yes</button>
            </div>
          </div>
        </motion.div>
      )}
    </form>
  );
}