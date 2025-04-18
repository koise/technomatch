// src/Components/Auth/Signup/PhaseOne.jsx
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSignup } from '@/context/SignupContext';
import { User, Mail, Briefcase } from 'lucide-react';

export default function PhaseOne({ onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setFormData, formData } = useSignup();

  const onSubmit = data => {
    console.log('Form Data:', data);
    setFormData(prev => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form phase-one">
      <div className="field-group">
        <div className="relative w-full">
          <input 
            placeholder="First Name" 
            defaultValue={formData.firstName}
            {...register('firstName', { required: 'First name is required' })} 
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="relative w-full">
          <input 
            placeholder="Last Name" 
            defaultValue={formData.lastName}
            {...register('lastName', { required: 'Last name is required' })}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName.message}</p>
          )}
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
        {errors.role && (
          <p className="error-message">{errors.role.message}</p>
        )}
      </div>

      <motion.button 
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue
      </motion.button>
    </form>
  );
}