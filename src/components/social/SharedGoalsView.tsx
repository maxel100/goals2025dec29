import React from 'react';
import { Loader2, Lock, X } from 'lucide-react';
import { categories } from '../../data/categories';
import { Goal } from '../../types';
import { useSharedGoals } from '../../hooks/useSharedGoals';

interface SharedGoalsViewProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

export function SharedGoalsView({ userId, userEmail, onClose }: SharedGoalsViewProps) {
  const { goals, isLoading, error } = useSharedGoals(userId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{userEmail}'s Goals</h2>
            <p className="text-sm text-gray-500">{goals.length} goals total</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 p-8 text-red-600">
              <Lock className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              No goals found
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(
                goals.reduce((acc, goal) => {
                  const category = goal.category as keyof typeof categories;
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(goal);
                  return acc;
                }, {} as Record<string, Goal[]>)
              ).map(([category, categoryGoals]) => {
                const CategoryIcon = categories[category as keyof typeof categories]?.icon;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      {CategoryIcon && <CategoryIcon className="w-5 h-5 text-primary-600" />}
                      <h3 className="font-medium text-gray-900">
                        {categories[category as keyof typeof categories]?.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      {categoryGoals.map(goal => (
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
          )}
        </div>
      </div>
    </div>
  );
}

function getGoalProgress(goal: Goal): string {
  switch (goal.type) {
    case 'simple':
      return goal.completed ? '✓ Completed' : 'In Progress';
    case 'quantifiable':
      return `${goal.progress || 0}/${goal.target || 0} ${goal.unit || ''}`;
    case 'monthly':
      const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
      return `${completedMonths}/12 months`;
    default:
      return 'In Progress';
  }
}