import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface WizardStepProps {
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLast?: boolean;
}

export function WizardStep({ 
  stepNumber,
  totalSteps,
  children, 
  onNext, 
  onBack, 
  onSkip,
  isLast
}: WizardStepProps) {
  const isFirstStep = stepNumber === 1;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{Math.round((stepNumber / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Skip for now
          </button>
        )}
        <button
          onClick={onNext}
          className={`px-8 py-3 text-white rounded-lg transition-colors ${
            isFirstStep 
              ? 'bg-landing-green hover:bg-landing-green/90 text-lg font-medium shadow-lg hover:shadow-xl'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {isFirstStep ? 'Get Started' : isLast ? 'Complete Setup' : 'Continue'}
        </button>
      </div>
    </div>
  );
}