import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, BookOpen } from 'lucide-react';
import { LifeMissionSection } from './LifeMissionSection';
import { YearlyReflection } from './YearlyReflection';

export function ReflectionsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  const iconGradientClass = "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500";

  return (
    <div className="max-w-7xl mx-auto mb-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white rounded-xl shadow-sm border border-primary-100 p-4 hover:shadow-md transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <Target className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500" />
            </div>
            <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
              <BookOpen className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500" />
            </div>
          </div>
          <span className="font-medium text-gray-900">Your Reflections & Mission</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LifeMissionSection />
            <YearlyReflection />
          </div>
        </div>
      )}
    </div>
  );
}