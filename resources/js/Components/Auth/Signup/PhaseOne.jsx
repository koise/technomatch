// src/components/PhaseOne.jsx
import { useForm } from 'react-hook-form';
import { useSignup } from '../../../context/SignupContext';
import styles from '../../../../scss/Components/Auth/Signup/PhaseOne.module.scss';

export default function PhaseOne({ onNext }) {
  const { register, handleSubmit } = useForm();
  const { setFormData } = useSignup();

  const onSubmit = data => {
    console.log('Form Data:', data); // Log the form data when submitted
    setFormData(prev => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input placeholder="First Name" {...register('firstName')} required />
      <input placeholder="Last Name" {...register('lastName')} required />
      <select {...register('role')} required>
        <option value="">Select Role</option>
        <option value="Student">Student</option>
        <option value="Instructor">Instructor</option>
        <option value="Admin">Admin</option>
      </select>
      <input placeholder="Email" type="email" {...register('email')} required />
      <button type="submit">Next</button>
    </form>
  );
}
