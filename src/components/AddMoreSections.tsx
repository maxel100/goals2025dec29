import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { categories } from '../data/categories';
import { AddGoalModal } from './goals/AddGoalModal';
import type { CategoryKey } from '../data/categories';

interface AddMoreSectionsProps {
  hiddenCategories: CategoryKey[];
}

export function AddMoreSections({ hiddenCategories }: AddMoreSectionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  if (hiddenCategories.length === 0) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 transition-all hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 cursor-pointer flex-grow"
          >
            <div className="p-3 rounded-lg bg-purple-100">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add More Sections</h3>
              <p className="text-sm text-gray-500">{hiddenCategories.length} available categories</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hiddenCategories.map((categoryKey) => {
              const category = categories[categoryKey];
              if (!category) return null;

              return (
                <div
                  key={categoryKey}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  <category.icon className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{category.title}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCategory && (
        <AddGoalModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </>
  );
}