import React from 'react';
import { Goal } from '../../types';
import { categories } from '../../data/categories';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateProgress } from '../../utils/calculations';

interface SharedGoalCardProps {
  goal: Goal;
}

export function SharedGoalCard({ goal }: SharedGoalCardProps) {
  const category = categories[goal.category as keyof typeof categories];
  const Icon = category?.icon;

  const progress = (() => {
    switch (goal.type) {
      case 'simple':
        return goal.completed ? 100 : 0;
      case 'quantifiable':
        return calculateProgress(goal.progress || 0, goal.target || 0);
      case 'monthly':
        const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
        return calculateProgress(completedMonths, 12);
      default:
        return 0;
    }
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-900">{goal.title}</h3>
          <p className="text-sm text-gray-500">{category?.title}</p>
        </div>
      </div>

      <div className="space-y-2">
        <ProgressBar progress={progress} />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{category?.title}</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
      </div>
    </div>
  );
}