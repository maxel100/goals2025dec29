import React from 'react';
import { Goal } from '../../types';
import { categories } from '../../data/categories';
import { calculateProgress } from '../../utils/calculations';

interface SharedGoalsListProps {
  goals: Goal[];
}

export function SharedGoalsList({ goals }: SharedGoalsListProps) {
  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    const category = goal.category as keyof typeof categories;
    if (!acc[category]) acc[category] = [];
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  const getGoalProgress = (goal: Goal) => {
    switch (goal.type) {
      case 'simple':
        return goal.completed ? '✓ Completed' : 'In Progress';
      case 'quantifiable':
        return `${goal.progress}/${goal.target} ${goal.unit}`;
      case 'monthly':
        const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
        return `${completedMonths}/12 months`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedGoals).map(([category, goals]) => {
        const CategoryIcon = categories[category as keyof typeof categories]?.icon;
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {CategoryIcon && <CategoryIcon className="w-5 h-5 text-primary-600" />}
              <h3 className="font-medium text-gray-900">
                {categories[category as keyof typeof categories]?.title}
              </h3>
            </div>
            
            <div className="grid gap-3">
              {goals.map(goal => (
                <div 
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{goal.title}</span>
                  <span className="text-sm text-primary-600 font-medium">
                    {getGoalProgress(goal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}