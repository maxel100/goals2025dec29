import React, { useMemo } from 'react';
import { Goal } from '../types';
import { IconBadge } from './ui/IconBadge';
import { ProgressBar } from './ui/ProgressBar';
import { GoalItem } from './goals/GoalItem';
import { AddGoalButton } from './goals/AddGoalButton';
import { calculateProgress } from '../utils/calculations';
import { categories } from '../data/categories';
import { useHiddenCategories } from '../hooks/useHiddenCategories';
import type { CategoryKey } from '../data/categories';
import { EyeOff } from 'lucide-react';

const getCategoryColors = (category: CategoryKey): { bg: string; text: string } => {
  const colors: Record<CategoryKey, { bg: string; text: string }> = {
    health: { bg: '#FFE4E4', text: '#B91C1C' },
    mind: { bg: '#F4F4E0', text: '#4A4A40' },
    emotions: { bg: '#FFE4FF', text: '#9D174D' },
    relationships: { bg: '#E0E7FF', text: '#3730A3' },
    mission: { bg: '#E0F2F1', text: '#065F46' },
    money: { bg: '#FEF3C7', text: '#92400E' },
    family: { bg: '#F3E8FF', text: '#6B21A8' },
    lifestyle: { bg: '#ECFDF5', text: '#047857' },
    contribution: { bg: '#F0FDF4', text: '#166534' },
    spirituality: { bg: '#EFF6FF', text: '#1E40AF' }
  };

  return colors[category] || { bg: '#F4F4E0', text: '#4A4A40' };
};

interface CategoryCardProps {
  category: CategoryKey;
  goals: Goal[];
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
}

export function CategoryCard({ category, goals, onUpdateGoal }: CategoryCardProps) {
  const categoryInfo = categories[category];
  const { hideCategory } = useHiddenCategories();
  const colors = getCategoryColors(category);
  
  if (!categoryInfo) return null;
  
  const progress = useMemo(() => {
    if (goals.length === 0) return 0;

    const totalProgress = goals.reduce((sum, goal) => {
      switch (goal.type) {
        case 'simple':
          return sum + (goal.completed ? 100 : 0);
        case 'quantifiable':
          return sum + ((goal.progress / goal.target) * 100);
        case 'monthly':
          const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
          return sum + ((completedMonths / 12) * 100);
        default:
          return sum;
      }
    }, 0);
    
    return calculateProgress(totalProgress, goals.length * 100);
  }, [goals]);

  const handleHide = () => {
    hideCategory(category);
  };

  const renderContent = () => {
    if (goals.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleHide}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
              title="Hide section"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Add your own goals or hide this section if you don't need it right now.
            </p>
            <AddGoalButton category={category} />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6">
          <ProgressBar progress={progress} />
        </div>
        <ul className="space-y-4">
          {goals.map(goal => (
            <li key={goal.id}>
              <GoalItem goal={goal} onUpdate={onUpdateGoal} />
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <AddGoalButton category={category} />
        </div>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border border-primary-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            {categoryInfo.icon && (
              <categoryInfo.icon 
                className="w-6 h-6"
                style={{ color: colors.text }}
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{categoryInfo.title}</h3>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
}