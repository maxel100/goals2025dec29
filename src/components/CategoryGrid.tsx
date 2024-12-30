import React from 'react';
import { CategoryCard } from './CategoryCard';
import { AddMoreSections } from './AddMoreSections';
import { useHiddenCategories } from '../hooks/useHiddenCategories';
import { categories } from '../data/categories';
import type { Goal } from '../types';
import type { CategoryKey } from '../data/categories';

interface CategoryGridProps {
  groupedGoals: Record<string, Goal[]>;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
}

export function CategoryGrid({ groupedGoals, onUpdateGoal }: CategoryGridProps) {
  const { hiddenCategories } = useHiddenCategories();

  // Get categories that have goals
  const activeCategories = Object.keys(groupedGoals).filter(
    category => groupedGoals[category]?.length > 0
  );

  // Get categories that are hidden and have no goals
  const emptyCategories = Object.keys(categories).filter(
    category => 
      !activeCategories.includes(category) && 
      !hiddenCategories.includes(category as CategoryKey)
  ) as CategoryKey[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Show active categories */}
      {activeCategories.map((category) => (
        <CategoryCard
          key={category}
          category={category as CategoryKey}
          goals={groupedGoals[category] || []}
          onUpdateGoal={onUpdateGoal}
        />
      ))}
      
      {/* Show Add More Sections panel if there are hidden categories */}
      <AddMoreSections hiddenCategories={[...hiddenCategories, ...emptyCategories]} />
    </div>
  );
}