import { useState } from 'react';
import { motion } from 'framer-motion';
import { SignupProvider } from '@/context/SignupContext';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import HeaderUnverified from '@/Components/Partials/HeaderUnverified';
import { ThemeProvider } from '@/context/ThemeContext';
import '../../../scss/Pages/Signup.scss';

const VerifyUser = () => {
  const [formData, setFormData] = useState({
    phaseOneInput: localStorage.getItem('phaseOneInput') || '',
    phaseTwoInput: localStorage.getItem('phaseTwoInput') || '',
    phaseThreeInput: localStorage.getItem('phaseThreeInput') || '',
  });

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const next = () => {
    console.log('Verification complete');
    // you can navigate somewhere or trigger a success action here
  };

  const previous = () => {
    console.log('Go back');
    // you can navigate back or handle it differently if needed
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
                <h2>Verify your account</h2>
              </div>

              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
                className="slide-up"
              >
                <PhaseTwo formData={formData} setFormData={setFormData} onNext={next} onBack={previous} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SignupProvider>
    </ThemeProvider>
  );
};

export default VerifyUser;
