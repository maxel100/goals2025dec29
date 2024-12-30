import React from 'react';
import { categories } from '../../data/categories';
import { Goal } from '../../types';
import { calculateProgress } from '../../utils/calculations';

interface SharedGoalsSummaryProps {
  goals: Goal[];
  userEmail: string;
}

export function SharedGoalsSummary({ goals, userEmail }: SharedGoalsSummaryProps) {
  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    const category = goal.category as keyof typeof categories;
    if (!acc[category]) acc[category] = [];
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  // Calculate category progress
  const categoryProgress = Object.entries(groupedGoals).map(([category, goals]) => {
    const totalProgress = goals.reduce((sum, goal) => {
      switch (goal.type) {
        case 'simple':
          return sum + (goal.completed ? 100 : 0);
        case 'quantifiable':
          return sum + calculateProgress(goal.progress || 0, goal.target || 0);
        case 'monthly':
          const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
          return sum + (completedMonths / 12) * 100;
        default:
          return sum;
      }
    }, 0);

    return {
      category,
      progress: Math.round(totalProgress / goals.length),
      count: goals.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{userEmail}'s Goals</h2>
        <div className="text-sm text-gray-500">
          {goals.length} goals total
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryProgress.map(({ category, progress, count }) => {
          const CategoryIcon = categories[category as keyof typeof categories]?.icon;
          return (
            <div key={category} className="bg-white rounded-lg shadow-sm border border-primary-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                {CategoryIcon && (
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <CategoryIcon className="w-5 h-5 text-primary-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {categories[category as keyof typeof categories]?.title}
                  </h3>
                  <p className="text-sm text-gray-500">{count} goals</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-primary-600">{progress}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}