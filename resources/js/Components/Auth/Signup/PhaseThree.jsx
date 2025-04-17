// src/components/PhaseThree.jsx
import { useForm } from 'react-hook-form';
import { useSignup } from '../../../context/SignupContext';
import styles from '../../../../scss/Components/Auth/Signup/PhaseThree.module.scss';

export default function PhaseThree({ onNext }) {
  const { register, handleSubmit, watch } = useForm();
  const { setFormData } = useSignup();
  const password = watch("password");

  const onSubmit = data => {
    setFormData(prev => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input placeholder="In-game Username" {...register('username')} required />
      <input placeholder="Password" type="password" {...register('password')} required />
      <input placeholder="Confirm Password" type="password" {...register('confirmPassword', {
        validate: value => value === password || "Passwords do not match"
      })} required />
      <button type="submit">Next</button>
    </form>
  );
}
