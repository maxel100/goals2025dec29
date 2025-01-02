import React, { useState } from 'react';
import { useQuarterlyGoals } from '../../hooks/useQuarterlyGoals';
import { Loader2 } from 'lucide-react';

export function PrioritiesSettings() {
  const { goals: quarterlyGoals, isLoading: isQuarterlyLoading, toggleVisibility } = useQuarterlyGoals(new Date());
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleQuarterly = async (checked: boolean) => {
    setIsToggling(true);
    await toggleVisibility(checked);
    setIsToggling(false);
  };

  if (isQuarterlyLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Quarterly Goals</h4>
            <p className="text-sm text-gray-600">
              Set and track your quarterly objectives
            </p>
          </div>
          <div className="relative">
            {isToggling && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              </div>
            )}
            <label className={`relative inline-flex items-center cursor-pointer ${isToggling ? 'opacity-0' : ''}`}>
              <input
                type="checkbox"
                checked={quarterlyGoals?.is_visible ?? false}
                onChange={(e) => handleToggleQuarterly(e.target.checked)}
                disabled={isToggling}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 