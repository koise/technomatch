// src/components/FinalPhase.jsx
import { useForm } from 'react-hook-form';
import { useSignup } from '../../../context/SignupContext';
import styles from '../../../../scss/Components/Auth/Signup/FinalPhase.module.scss';

export default function FinalPhase() {
  const { register, handleSubmit } = useForm();
  const { setFormData } = useSignup();

  const onSubmit = data => {
    setFormData(prev => ({ ...prev, ...data }));
    console.log('Final Form Submission:', { ...data });
    alert('Signup Complete!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label>Preferred Programming Language</label>
      <select {...register('language')} multiple>
        <option value="Java">Java</option>
        <option value="C">C Language</option>
        <option value="Python">Python</option>
      </select>
      <input placeholder="School (Optional)" {...register('school')} />
      <textarea placeholder="Bio" {...register('bio')} />
      <button type="submit">Finish Signup</button>
    </form>
  );
}
