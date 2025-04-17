import { useState } from 'react';
import { SignupProvider } from '@/context/SignupContext';
import PhaseOne from '@/Components/Auth/Signup/PhaseOne';
import PhaseTwo from '@/Components/Auth/Signup/PhaseTwo';
import PhaseThree from '@/Components/Auth/Signup/PhaseThree';
import FinalPhase from '@/Components/Auth/Signup/FinalPhase';
import StepNavigation from '@/Components/Auth/Signup/StepNavigation';
import LoginHeader from '@/Components/Partials/LoginHeader';
import { ThemeProvider } from '@/context/ThemeContext';

const Signup = () => {
  const [step, setStep] = useState(0); 
  
  const next = () => {
    console.log(`Going to next step: ${step + 1}`);
    setStep(prev => prev + 1);
  };
  
  return (
    <ThemeProvider>
      <LoginHeader />
      <SignupProvider>
        <div className="min-h-screen bg-[#fffffa] text-[#000103]">
          <div className="max-w-xl mx-auto py-10 px-6">
            <StepNavigation step={step} />
            {step === 0 && <PhaseOne onNext={next} />}
            {step === 1 && <PhaseTwo onNext={next} />}
            {step === 2 && <PhaseThree onNext={next} />}
            {step === 3 && <FinalPhase />}
          </div>
        </div>
      </SignupProvider>
    </ThemeProvider>
  );
};

export default Signup;
