import React from 'react';

interface ComparisonProgressProps {
  progress: number;
}

export function ComparisonProgress({ progress }: ComparisonProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Interactive Demo Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-landing-green rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}