import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export function ProgressBar({ progress, size = 'sm', showLabel = true }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-2' : 'h-3';
  
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`bg-gradient-to-r from-landing-purple to-landing-blue rounded-full ${height} transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}