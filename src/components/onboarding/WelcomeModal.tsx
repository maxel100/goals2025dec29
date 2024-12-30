import React from 'react';
import { Rocket, Sparkles, X, ArrowRight, Clock } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onStartGuided: () => void;
  onStartQuick: () => void;
}

export function WelcomeModal({ onClose, onStartGuided, onStartQuick }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Dream Year</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            Let's set you up for success. Choose how you'd like to begin your journey.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 grid gap-4 md:grid-cols-2">
          {/* Guided Option */}
          <button
            onClick={onStartGuided}
            className="flex flex-col p-6 bg-primary-50 border-2 border-primary-100 rounded-xl hover:border-primary-200 transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex items-center gap-1 text-sm text-primary-600">
                <Clock className="w-4 h-4" />
                ~10 minutes
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Guided Setup
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get personalized guidance and reflect on your goals with our AI coach. 
              We'll help you create a meaningful plan tailored to your aspirations.
            </p>
            <div className="flex items-center gap-2 text-primary-600 mt-auto group-hover:gap-3 transition-all">
              <span className="font-medium">Start Guided Journey</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Quick Start Option */}
          <button
            onClick={onStartQuick}
            className="flex flex-col p-6 bg-gray-50 border-2 border-gray-100 rounded-xl hover:border-gray-200 transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Rocket className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                2 minutes
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Start
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Jump right in and start adding your goals. You can always use the AI guidance 
              later when you want to dive deeper.
            </p>
            <div className="flex items-center gap-2 text-gray-600 mt-auto group-hover:gap-3 transition-all">
              <span className="font-medium">Start Adding Goals</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Don't worry, you can switch between guided and self-directed modes anytime.
            Your progress is automatically saved.
          </p>
        </div>
      </div>
    </div>
  );
} 