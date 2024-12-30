import React, { useState } from 'react';
import { MonthlyGoal } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

interface Props {
  goal: MonthlyGoal;
  onUpdate: (goalId: string, updates: Partial<MonthlyGoal>) => void;
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function MonthlyGoalItem({ goal, onUpdate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
  const progress = (completedMonths / 12) * 100;

  const toggleMonth = (monthIndex: number) => {
    const updatedProgress = {
      ...goal.monthlyProgress,
      [monthIndex]: !goal.monthlyProgress?.[monthIndex]
    };

    onUpdate(goal.id, {
      monthlyProgress: updatedProgress
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm hover:text-primary-600"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{goal.title}</span>
        </button>
        <span className="text-sm text-gray-500">
          {completedMonths}/12 months
        </span>
      </div>
      
      <ProgressBar progress={progress} size="sm" />
      
      {isExpanded && (
        <div className="grid grid-cols-4 gap-2 pl-6 mt-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => toggleMonth(index)}
              className={`text-sm p-2 rounded transition-colors ${
                goal.monthlyProgress?.[index]
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}