import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGoalStore } from '../../store/goalStore';
import { GoalTypeSelector } from './GoalTypeSelector';
import { GoalForm } from './GoalForm';
import { generateId } from '../../utils/calculations';
import { exampleGoals } from '../../data/exampleGoals';
import { categories } from '../../data/categories';

interface AddGoalModalProps {
  category: string;
  onClose: () => void;
}

export function AddGoalModal({ category, onClose }: AddGoalModalProps) {
  const [selectedType, setSelectedType] = useState<'simple' | 'quantifiable' | 'monthly' | null>(null);
  const { addGoal } = useGoalStore();

  const suggestions = exampleGoals[category] || [];
  const categoryInfo = categories[category as keyof typeof categories];

  const handleSubmit = async (formData: any) => {
    if (!selectedType) return;

    const baseGoalData = {
      id: generateId(),
      category,
      type: selectedType,
      title: formData.title,
    };

    let goalData;
    switch (selectedType) {
      case 'quantifiable':
        goalData = {
          ...baseGoalData,
          progress: 0,
          target: formData.target || 0,
          unit: formData.unit,
          trackingType: formData.trackingType || 'slider',
          items: []
        };
        break;

      case 'monthly':
        goalData = {
          ...baseGoalData,
          monthlyProgress: {}
        };
        break;

      case 'simple':
        goalData = {
          ...baseGoalData,
          completed: false
        };
        break;

      default:
        console.error('Invalid goal type:', selectedType);
        return;
    }

    await addGoal(goalData);
    onClose();
  };

  const handleSuggestionClick = (suggestion: any) => {
    const baseGoalData = {
      id: generateId(),
      category,
      type: suggestion.type,
      title: suggestion.title,
    };

    let goalData;
    switch (suggestion.type) {
      case 'quantifiable':
        goalData = {
          ...baseGoalData,
          progress: 0,
          target: suggestion.target || 0,
          unit: suggestion.unit,
          trackingType: suggestion.trackingType || 'slider',
          items: []
        };
        break;

      case 'monthly':
        goalData = {
          ...baseGoalData,
          monthlyProgress: {}
        };
        break;

      case 'simple':
        goalData = {
          ...baseGoalData,
          completed: false
        };
        break;

      default:
        console.error('Invalid goal type:', suggestion.type);
        return;
    }

    addGoal(goalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Goal
          </h2>

          {!selectedType ? (
            <>
              <GoalTypeSelector onSelect={setSelectedType} />
              {suggestions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Example {categoryInfo?.title} Goals
                  </h3>
                  <select
                    onChange={(e) => {
                      const suggestion = suggestions.find(s => s.title === e.target.value);
                      if (suggestion) {
                        handleSuggestionClick(suggestion);
                      }
                    }}
                    className="w-full p-3 text-sm text-gray-600 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select an example goal...</option>
                    {suggestions.map((suggestion) => (
                      <option key={suggestion.id} value={suggestion.title}>
                        {suggestion.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <GoalForm
              type={selectedType}
              onSubmit={handleSubmit}
              onBack={() => setSelectedType(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
