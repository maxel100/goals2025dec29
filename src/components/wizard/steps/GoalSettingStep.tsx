import React, { useState } from 'react';
import { categories } from '../../../data/categories';
import { Brain, Target, Plus, AlertTriangle } from 'lucide-react';
import { AddGoalModal } from '../../goals/AddGoalModal';
import { useGoalStore } from '../../../store/goalStore';

interface GoalSettingStepProps {
  onNext: () => void;
}

export function GoalSettingStep({ onNext }: GoalSettingStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const goals = useGoalStore(state => state.goals);

  const handleNext = () => {
    if (goals.length < 2) {
      setError('Please add at least 2 goals before continuing');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-gray-600">
          Now it's time to set your goals! Remember these key principles for effective goal setting:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-medium text-primary-900">Believability Score</h3>
            </div>
            <p className="text-sm text-primary-800">
              Only set goals with a believability score of 7/10 or higher. This ensures you're
              setting goals you truly believe you can achieve.
            </p>
          </div>

          <div className="bg-primary-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Brain className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-medium text-primary-900">Excitement Level</h3>
            </div>
            <p className="text-sm text-primary-800">
              Choose goals that excite you (7/10 or higher). Emotional investment is key to
              maintaining motivation throughout your journey.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Available Categories:</h3>
          <p className="text-sm text-gray-600">
            {goals.length} / 2 goals minimum
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categories).map(([key, category]) => {
            const categoryGoals = goals.filter(g => g.category === key);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{category.title}</h4>
                      <p className="text-sm text-gray-600">{categoryGoals.length} goals</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(key)}
                    className="p-1 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {categoryGoals.length > 0 && (
                  <ul className="pl-4 space-y-1">
                    {categoryGoals.map(goal => (
                      <li key={goal.id} className="text-sm text-gray-600">
                        • {goal.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedCategory && (
        <AddGoalModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}