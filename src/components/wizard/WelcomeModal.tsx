import React from 'react';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { OnboardingMode } from '../../hooks/useWizardState';

interface WelcomeModalProps {
  onSelectMode: (mode: OnboardingMode) => void;
}

export function WelcomeModal({ onSelectMode }: WelcomeModalProps) {
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-200 to-blue-200 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <span className="text-black font-medium">Welcome to AI Goals Board</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Let's Set Up Your Goals Board
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Choose how you'd like to get started. You can always modify your goals later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <button
          onClick={() => onSelectMode('guided')}
          className="p-6 text-left border-2 border-yellow-200 bg-yellow-50 rounded-xl transition-all transform hover:scale-[1.02] relative"
        >
          <div className="absolute -top-3 left-4 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            Recommended
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Guided Setup
              </h3>
              <p className="text-gray-600 mb-2">
                We'll walk you through creating personalized goals with our AI coach. Perfect if you want a tailored experience.
              </p>
              <p className="text-sm text-yellow-700">
                ~10 minutes • Sets you up for success all year
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectMode('quick')}
          className="p-6 text-left border-2 border-gray-200 rounded-xl transition-all transform hover:scale-[1.02] hover:border-gray-300"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Start
              </h3>
              <p className="text-gray-600 mb-2">
                Get started instantly with pre-set goals across all life areas. Best if you want to dive right in.
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                ~1 minute
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
} 