import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSignup } from '@/context/SignupContext';
import { ArrowLeft, BadgeCheck, Camera, Check } from 'lucide-react';

export default function FinalPhase({ onBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setFormData, formData } = useSignup();
  const [submitted, setSubmitted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(formData.avatar || 'default-1.svg');

  // Default avatar options
  const avatarOptions = [
    'default-1.svg',
    'default-2.svg',
    'default-3.svg',
    'default-4.svg',
    'default-5.svg',
    'default-6.svg',
    'default-7.svg',
    'default-8.svg',
    'default-9.svg',
    'default-10.svg',
    'default-11.svg',
    'default-12.svg',
  ];

  const onSubmit = data => {
    if (data.language && !Array.isArray(data.language)) {
      data.language = [data.language];
    }

    const finalPayload = { 
      ...formData, 
      ...data,
      avatar: selectedAvatar 
    };
    
    setFormData(finalPayload);

    console.log('%c✅ Final Signup Data:', 'color: green; font-weight: bold;', finalPayload);
    console.log('📦 Final JSON:', JSON.stringify(finalPayload, null, 2));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          fontSize: '1rem',
          color: '#888',
          marginBottom: '2rem',
          animation: 'fadeInUp 0.8s ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            margin: '0 auto 1rem',
            backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green bg
            borderRadius: '50%',
          }}
        >
          <BadgeCheck
            style={{
              width: '2rem',
              height: '2rem',
              color: '#ff312e',
            }}
          />
        </div>
        <h3
          style={{
            fontWeight: 700,
            marginBottom: '0.5rem',
            fontSize: '1.25rem',
            color: '#ff312e',
          }}
        >
          Account Created Successfully!
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#ff312e',
            maxWidth: '28rem',
            margin: '0 auto 1.5rem',
          }}
        >
          Thank you for signing up. Your account has been created and is ready to use.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (window.location.href = '/dashboard')}
          style={{
            backgroundColor: '#ff312e',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Go to Dashboard
        </motion.button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form final-phase">
      {/* Profile Picture Selection */}
      <div className="profile-avatar-section">
        <label>Choose Avatar </label>
        <div className="avatar-grid">
          {avatarOptions.map((avatar) => (
            <div 
              key={avatar} 
              className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
            >
              <div className="avatar-wrapper">
                <img 
                  src={`/avatar/${avatar}`} 
                  alt={`Avatar ${avatar}`} 
                  className="avatar-image"
                />
                {selectedAvatar === avatar && (
                  <div className="selected-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <label>Preferred Programming Languages (Optional)</label>
      <select 
        {...register('language')}
        multiple
        defaultValue={formData.language || []}
      >
        <option value="Java">Java</option>
        <option value="C">C Language</option>
        <option value="Python">Python</option>
      </select>

      <label>School or Institution (Optional)</label>
      <input 
        placeholder="Enter your school or institution" 
        {...register('school')}
        defaultValue={formData.school || ''}
      />

      <label>Bio (Optional)</label>
      <textarea 
        placeholder="Tell us about yourself" 
        {...register('bio', { maxLength: { value: 500, message: 'Bio must be less than 500 characters' } })}
        defaultValue={formData.bio || ''}
      />
      {errors.bio && (
        <p className="error-message">{errors.bio.message}</p>
      )}

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
        >
          Complete Signup
        </motion.button>
      </div>
    </form>
  );
}