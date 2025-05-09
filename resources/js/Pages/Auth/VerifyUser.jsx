import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignupProvider } from '@/context/SignupContext';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import FinalPhase from '@/Components/Auth/Signup/FinalPhase';
import StepNavigation from '@/Components/Auth/Signup/StepNavigation';
import HeaderUnverified from '@/Components/Partials/HeaderUnverified';
import { ThemeProvider } from '@/context/ThemeContext';
import axios from 'axios';
import '../../../scss/Pages/Signup.scss';

const VerifyUser = () => {
  // Get step from localStorage or default to 0
  const storedStep = localStorage.getItem('verifyStep');
  const [step, setStep] = useState(2);
  const [user, setUser] = useState(null);
  
  // Form data state management
  const [formData, setFormData] = useState({
    email: '',
    phaseTwoInput: localStorage.getItem('phaseTwoInput') || '',
    finalPhaseInput: localStorage.getItem('finalPhaseInput') || '',
  });

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('verifyStep', step);
  }, [step]);

  // Get URL params and user data
  useEffect(() => {
    // Get email from URL params if available
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    } else {
      // If no email param, fetch user data
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/fetch-user');
      if (response.data.user) {
        setUser(response.data.user);
        setFormData(prev => ({ 
          ...prev, 
          email: response.data.user.email 
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      <HeaderUnverified refreshUser={fetchUserData} />
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