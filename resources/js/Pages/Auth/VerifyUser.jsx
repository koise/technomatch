import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignupProvider } from '@/context/SignupContext';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import FinalPhase from '@/Components/Auth/Signup/FinalPhase';
import StepNavigation from '@/Components/Auth/Signup/StepNavigation';
import HeaderUnverified from '@/Components/Partials/HeaderUnverified';
import { ThemeProvider } from '@/context/ThemeContext';
import '../../../scss/Pages/Signup.scss';

const VerifyUser = () => {
  // Get step from localStorage or default to 0
  const storedStep = localStorage.getItem('verifyStep');
  const [step, setStep] = useState(2);
  
  // Form data state management
  const [formData, setFormData] = useState({
    phaseTwoInput: localStorage.getItem('phaseTwoInput') || '',
    finalPhaseInput: localStorage.getItem('finalPhaseInput') || '',
  });

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('verifyStep', step);
  }, [step]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const next = () => {
    console.log(`Going to next step: ${step + 1}`);
    setStep(prev => prev + 1);
  };

  const previous = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      console.log('Go back to previous page');
      // Add navigation logic here if needed
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 3:
        return "Verify and Complete Your Profile";
      default:
        return "Account Verification";
    }
  };

  return (
    <ThemeProvider>
      <HeaderUnverified />
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
                <h2>{getHeaderTitle()}</h2>
              </div>

              <StepNavigation currentStep={2} totalSteps={4} />

              <motion.div
                key={step}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
                className="slide-up"
              >
                {step === 2 && (
                  <>
                    <PhaseTwo formData={formData} setFormData={setFormData} onNext={next} onBack={previous} />
                  </>
                )} {step === 3 && <FinalPhase formData={formData} setFormData={setFormData} onBack={previous} />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SignupProvider>
    </ThemeProvider>
  );
};

export default VerifyUser;