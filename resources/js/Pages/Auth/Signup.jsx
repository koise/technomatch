import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignupProvider } from '@/context/SignupContext';
import PhaseOne from '@/Components/Auth/Signup/PhaseOne';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import PhaseThree from '@/Components/Auth/Signup/PhaseThree';
import FinalPhase from '@/Components/Auth/Signup/FinalPhase';
import StepNavigation from '@/Components/Auth/Signup/StepNavigation';
import LoginHeader from '@/Components/Partials/LoginHeader';
import { ThemeProvider } from '@/context/ThemeContext';
import '../../../scss/Pages/Signup.scss';

const Signup = () => {
  const storedStep = 0;
  const [step, setStep] = useState(storedStep ? parseInt(storedStep) : 0);

  const [formData, setFormData] = useState({
    phaseOneInput: localStorage.getItem('phaseOneInput') || '',
    phaseTwoInput: localStorage.getItem('phaseTwoInput') || '',
    phaseThreeInput: localStorage.getItem('phaseThreeInput') || '',
  });

  useEffect(() => {
    localStorage.setItem('signupStep', step);
  }, [step]);

  const next = () => {
    console.log(`Going to next step: ${step + 1}`);
    setStep(prev => prev + 1);
  };

  const previous = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // 🧠 Dynamic header logic
  const getHeaderTitle = () => {
    switch (step) {
      case 0:
        return "Create your account";
      case 2:
        return "Verify your account";
      case 3:
        return "Create your login credentials";
      case 3:
        return "Setup your profile";
      default:
        return "Signup";
    }
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
                <h2>{getHeaderTitle()}</h2>
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
