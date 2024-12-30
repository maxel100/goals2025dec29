import React, { useState } from 'react';
import { WelcomeModal } from './WelcomeModal';
import { GuidedSetup } from './GuidedSetup';

type OnboardingStep = 'welcome' | 'guided' | 'completed';

interface OnboardingContainerProps {
  onComplete: () => void;
}

export function OnboardingContainer({ onComplete }: OnboardingContainerProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');

  const handleStartGuided = () => {
    setStep('guided');
  };

  const handleStartQuick = () => {
    setStep('completed');
    onComplete();
  };

  const handleSkip = () => {
    setStep('completed');
    onComplete();
  };

  if (step === 'completed') {
    return null;
  }

  return (
    <>
      {step === 'welcome' && (
        <WelcomeModal
          onClose={handleSkip}
          onStartGuided={handleStartGuided}
          onStartQuick={handleStartQuick}
        />
      )}
      {step === 'guided' && (
        <GuidedSetup
          onComplete={() => {
            setStep('completed');
            onComplete();
          }}
          onSkip={handleSkip}
        />
      )}
    </>
  );
} 