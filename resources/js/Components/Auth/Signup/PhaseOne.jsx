import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSignup } from '@/context/SignupContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../scss/Components/Partials/modalAndToast.scss';
import axios from 'axios';

export default function PhaseOne({ onNext }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { setFormData, formData } = useSignup();
  const emailToastId = useRef(null);
  const [emailExists, setEmailExists] = useState(false);
  const emailCheckTimeout = useRef(null);
  
  const email = watch("email", "");

  useEffect(() => {
    return () => {
      if (emailToastId.current) {
        toast.dismiss(emailToastId.current);
      }
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
    };
  }, []);

  // Check email existence when email changes
  useEffect(() => {
    if (emailToastId.current) {
      toast.dismiss(emailToastId.current);
      emailToastId.current = null;
    }
    
    if (!email || !/^\S+@\S+$/i.test(email)) {
      setEmailExists(false);
      return;
    }

    if (emailCheckTimeout.current) {
      clearTimeout(emailCheckTimeout.current);
    }
    
    emailCheckTimeout.current = setTimeout(() => {
      axios.post('/check-email', { email })
        .then(response => {
          const exists = response.data.exists;
          setEmailExists(exists);
          
          if (exists) {
            emailToastId.current = toast.error("Email already exists.", {
              position: "bottom-left",
              autoClose: 3000,
              hideProgressBar: false, 
              closeOnClick: true,
              closeButton: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'email-exists-toast'
            });
          }
        })
        .catch(error => {
          console.error("Error checking email:", error);
        });
    }, 500);
    
    return () => {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }
    };
  }, [email]);

  const onSubmit = async (data) => {
    if (emailExists) {
      emailToastId.current = toast.error("Email already exists.", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false, 
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'email-exists-toast'
      });
      return;
    }

    setFormData(prev => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form phase-one">
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

      <div className="field-group">
        <div className="relative w-full">
          <input 
            placeholder="First Name" 
            defaultValue={formData.firstName}
            {...register('firstName', { required: 'First name is required' })} 
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
        </div>

        <div className="relative w-full">
          <input 
            placeholder="Last Name" 
            defaultValue={formData.lastName}
            {...register('lastName', { required: 'Last name is required' })}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="relative w-full">
        <select 
          defaultValue={formData.role}
          {...register('role', { required: 'Please select a role' })}
          className={errors.role ? 'error' : ''}
        >
          <option value="">Select Role</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
        </select>
        {errors.role && <p className="error-message">{errors.role.message}</p>}
      </div>

      <div className="relative w-full">
        <select
          defaultValue={formData.gender}
          {...register('gender', { required: 'Please select a gender' })}
          className={errors.gender ? 'error' : ''}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
          <option value="Others">Others</option>
        </select>
        {errors.gender && <p className="error-message">{errors.gender.message}</p>}
      </div>

      <div className="relative w-full">
        <input 
          placeholder="Email Address"
          type="email"
          defaultValue={formData.email}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format'
            }
          })}
          className={errors.email ? 'error' : emailExists ? 'error-exists' : ''}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      <motion.button 
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={emailExists}
      >
        Continue
      </motion.button>
    </form>
  );
}