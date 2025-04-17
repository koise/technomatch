import { motion } from 'framer-motion';

export default function StepNavigation({ step }) {
  const steps = ['Basic Info', 'Verify Email', 'Account Setup', 'Preferences'];
  return (
    <motion.div 
      className="step-navigation" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}>
      <p>Step {step + 1} of {steps.length}: {steps[step]}</p>
    </motion.div>
  );
}
