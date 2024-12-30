import React from 'react';
import { useHiddenCategories } from '../../hooks/useHiddenCategories';
import { categories } from '../../data/categories';
import { Eye } from 'lucide-react';

export function HiddenCategories() {
  const { hiddenCategories, showCategory } = useHiddenCategories();

  if (hiddenCategories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hidden categories
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {hiddenCategories.map(category => {
        const categoryInfo = categories[category];
        if (!categoryInfo) return null;

        return (
          <div
            key={category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <categoryInfo.icon className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">{categoryInfo.title}</span>
            </div>
            <button
              onClick={() => showCategory(category)}
              className="p-1 text-gray-400 hover:text-primary-600 rounded-full hover:bg-white"
              title="Show category"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}