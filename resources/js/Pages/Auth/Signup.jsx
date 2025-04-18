import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignupProvider } from '@/context/SignupContext';
import PhaseOne from '@/Components/Auth/Signup/PhaseOne';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import PhaseThree from '@/Components/Auth/Signup/PhaseThree';
import FinalPhase from '@/Components/Auth/Signup/FinalPhase';
import StepNavigation from '@/Components/Auth/Signup/StepNavigation';
import LoginHeader from '@/Components/Partials/LoginHeader';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import '../../../scss/Pages/Signup.scss';

const Signup = () => {
  const storedStep = localStorage.getItem('signupStep');
  const [step, setStep] = useState(storedStep ? parseInt(storedStep) : 0);

  // Retrieve saved inputs from localStorage, default to empty values
  const [formData, setFormData] = useState({
    phaseOneInput: localStorage.getItem('phaseOneInput') || '',
    phaseTwoInput: localStorage.getItem('phaseTwoInput') || '',
    phaseThreeInput: localStorage.getItem('phaseThreeInput') || '',
    // Add other fields here based on your form structure
  });

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('signupStep', step);
  }, [step]);

  // Save form data to localStorage whenever any field changes
  useEffect(() => {
    localStorage.setItem('phaseOneInput', formData.phaseOneInput);
    localStorage.setItem('phaseTwoInput', formData.phaseTwoInput);
    localStorage.setItem('phaseThreeInput', formData.phaseThreeInput);
    // Add other fields as necessary
  }, [formData]);

  const next = () => {
    console.log(`Going to next step: ${step + 1}`);
    setStep(prev => prev + 1);
  };

  const previous = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <ThemeProvider>
      <LoginHeader />
      <SignupProvider>
        <div className="signup-container">
          <div className="signup-wrapper">
            <motion.div
              className="signup-card fade-in"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.4 }}
            >
              <div className="signup-header">
                <h2>Create your account</h2>
              </div>

              <StepNavigation currentStep={step} totalSteps={4} />

              <motion.div
                key={step}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
                className="slide-up"
              >
                {step === 0 && <PhaseOne formData={formData} setFormData={setFormData} onNext={next} />}
                {step === 1 && <PhaseThree formData={formData} setFormData={setFormData} onNext={next} onBack={previous} />}
                {step === 2 && <PhaseTwo formData={formData} setFormData={setFormData} onNext={next} onBack={previous} />}
                {step === 3 && <FinalPhase formData={formData} setFormData={setFormData} onBack={previous} />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SignupProvider>
    </ThemeProvider>
  );
};

export default Signup;
