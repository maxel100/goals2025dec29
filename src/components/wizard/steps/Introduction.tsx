import React from 'react';
import { Rocket } from 'lucide-react';

export function Introduction() {
  return (
    <div className="text-center space-y-8">
      {/* Time Badge */}
      <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
        <Rocket className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-primary-700">5-10 min setup</span>
      </div>

      {/* Main Message */}
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Spend 5-10 minutes now to set up your AI-driven goals plan
        </h1>
        <p className="text-gray-600">
          Get personalized ideas and a clear roadmap to achieve your goals
        </p>
      </div>

      {/* Visual Element */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-primary-50 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      {/* Skip Notice */}
      <p className="text-sm text-gray-500">
        Skip any step and you can complete it later
      </p>
    </div>
  );
}