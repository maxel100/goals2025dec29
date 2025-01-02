import React from 'react';
import { X } from 'lucide-react';
import { WelcomeModal } from './WelcomeModal';
import { GuidedSetup } from './GuidedSetup';
import { QuickStart } from './QuickStart';
import { useWizardState } from '../../hooks/useWizardState';

interface WelcomeWizardProps {
  onClose: () => void;
}

export function WelcomeWizard({ onClose }: WelcomeWizardProps) {
  const { onboardingMode, startOnboarding, completeWizard } = useWizardState();

  const handleClose = async () => {
    await completeWizard();
    onClose();
  };

  const handleComplete = async () => {
    await completeWizard();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content area with fixed header and scrollable body */}
        <div className="flex-1 flex flex-col min-h-0">
          {!onboardingMode ? (
            <WelcomeModal onSelectMode={startOnboarding} />
          ) : onboardingMode === 'guided' ? (
            <GuidedSetup onComplete={handleComplete} />
          ) : (
            <QuickStart onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}