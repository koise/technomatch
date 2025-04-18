// src/Components/Auth/Signup/StepNavigation.jsx
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

export default function StepNavigation({ currentStep, totalSteps }) {
  const steps = ['Basic Info', 'Login Credentials', 'Email Verification', 'Preferences'];
  
  // Calculate progress width as a percentage
  const progressWidth = `${(currentStep / (totalSteps - 1)) * 100}%`;
  
  return (
    <div className="step-navigation">
      <p>Step {currentStep + 1} of {totalSteps}: {steps[currentStep]}</p>
      
      <div className="steps">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            {index < currentStep ? (
              <CheckIcon size={14} />
            ) : (
              index + 1
            )}
          </div>
        ))}
        
        <motion.div 
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: progressWidth }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}