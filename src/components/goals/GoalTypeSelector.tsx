import React from 'react';
import { Target, CheckSquare, Calendar } from 'lucide-react';

interface GoalTypeSelectorProps {
  onSelect: (type: 'simple' | 'quantifiable' | 'monthly') => void;
}

export function GoalTypeSelector({ onSelect }: GoalTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => onSelect('simple')}
        className="flex flex-col items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        <CheckSquare className="w-6 h-6 text-primary-600" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900">Yes/No Goal</h3>
          <p className="text-sm text-gray-500">Simple completion tracking</p>
        </div>
      </button>

      <button
        onClick={() => onSelect('quantifiable')}
        className="flex flex-col items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        <Target className="w-6 h-6 text-primary-600" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900">Progress Goal</h3>
          <p className="text-sm text-gray-500">Track progress towards a target</p>
        </div>
      </button>

      <button
        onClick={() => onSelect('monthly')}
        className="flex flex-col items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        <Calendar className="w-6 h-6 text-primary-600" />
        <div className="text-center">
          <h3 className="font-medium text-gray-900">Monthly Goal</h3>
          <p className="text-sm text-gray-500">Track monthly completion</p>
        </div>
      </button>
    </div>
  );
}
