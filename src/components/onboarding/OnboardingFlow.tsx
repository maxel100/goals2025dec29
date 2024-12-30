import React, { useState } from 'react';
import { YearlyDebrief } from './steps/YearlyDebrief';
import { LifeMission } from './steps/LifeMission';
import { GoalBrainstorm } from './steps/GoalBrainstorm';
import { InternalTalkSetup } from './steps/InternalTalkSetup';
import { ReviewGoals } from './steps/ReviewGoals';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useOnboarding } from '../../hooks/useOnboarding';

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const { data, updateData, isGenerating, generateGoals, error } = useOnboarding();

  const steps = [
    { component: YearlyDebrief, title: "Reflect on Your Journey" },
    { component: LifeMission, title: "Define Your Vision" },
    { component: GoalBrainstorm, title: "Set Your Goals" },
    { component: InternalTalkSetup, title: "Shape Your Mindset" },
    { component: ReviewGoals, title: "Review & Confirm" }
  ];

  const CurrentStep = steps[step].component;

  const handleNext = async (stepData: any) => {
    await updateData(stepData);
    
    if (step === steps.length - 1) {
      await generateGoals();
      return;
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(Math.max(0, step - 1));
  };

  if (isGenerating) {
    return (
      <LoadingScreen message="Creating your personalized goals board..." />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-landing-green rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            Step {step + 1} of {steps.length}: {steps[step].title}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <CurrentStep
          data={data}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={step === 0}
          isLast={step === steps.length - 1}
        />
      </div>
    </div>
  );
}