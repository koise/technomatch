// src/components/PhaseTwo.jsx
import { useForm } from 'react-hook-form';
import { useSignup } from '../../../context/SignupContext';
import styles from '../../../../scss/Components/Auth/Signup/PhaseTwo.module.scss';

export default function PhaseTwo({ onNext }) {
  const { register, handleSubmit } = useForm();
  const { formData, setFormData } = useSignup();

  const validateEmail = value =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || 'Invalid email format';

  const onSubmit = data => {
    setFormData(prev => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input
        defaultValue={formData.email}
        placeholder="Verify Email"
        {...register('email', { validate: validateEmail })}
      />
      <button type="submit">Verify & Next</button>
    </form>
  );
}
