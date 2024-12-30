import React from 'react';
import { Brain } from 'lucide-react';
import { YearlyDebrief } from './YearlyDebrief';
import { LifeMission } from './LifeMission';

export function AiCoachSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Brain className="w-8 h-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900">AI Coach</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <YearlyDebrief />
        <LifeMission />
      </div>
    </div>
  );
}