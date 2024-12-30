import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface GuidedSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = {
  title: string;
  description: string;
  question: string;
  placeholder: string;
};

const STEPS: Step[] = [
  {
    title: "Let's Start with Your Vision",
    description: "Think about where you want to be by the end of this year. What does success look like to you?",
    question: "What are your biggest aspirations for this year?",
    placeholder: "e.g., I want to advance in my career, improve my health, learn new skills..."
  },
  {
    title: "Identify Your Priorities",
    description: "Consider the different areas of your life. What matters most to you right now?",
    question: "Which areas of your life would you like to focus on?",
    placeholder: "e.g., Career growth, health & fitness, relationships, personal development..."
  },
  {
    title: "Define Your Challenges",
    description: "Understanding your challenges helps create a more realistic plan.",
    question: "What obstacles might you face in achieving your goals?",
    placeholder: "e.g., Time management, staying motivated, work-life balance..."
  },
  {
    title: "Your Support System",
    description: "Think about who can help you stay accountable and motivated.",
    question: "Who would you like to share your progress with?",
    placeholder: "e.g., Friends, family, mentor, coach..."
  },
  {
    title: "Your Commitment",
    description: "Let's make your goals real by committing to specific actions.",
    question: "How will you stay committed to your goals?",
    placeholder: "e.g., Daily check-ins, weekly reviews, monthly reflections..."
  }
];

export function GuidedSetup({ onComplete, onSkip }: GuidedSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(STEPS.length).fill(''));

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onSkip();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleResponseChange = (response: string) => {
    const newResponses = [...responses];
    newResponses[currentStep] = response;
    setResponses(newResponses);
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onSkip}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
          </div>
          <p className="text-gray-600">{step.description}</p>
          
          {/* Progress bar */}
          <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {step.question}
          </label>
          <textarea
            value={responses[currentStep]}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={step.placeholder}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              {currentStep === 0 ? 'Skip Setup' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={!responses[currentStep].trim()}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 flex items-center gap-2"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 