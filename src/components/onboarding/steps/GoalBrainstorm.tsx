import React, { useState } from 'react';
import { StepProps } from '../types';
import { StepContainer } from '../ui/StepContainer';
import { TextArea } from '../ui/TextArea';
import { Plus, X } from 'lucide-react';
import { useGoalBrainstorm } from '../../../hooks/useGoalBrainstorm';

const categories = [
  { id: 'health', label: 'Health & Fitness' },
  { id: 'mind', label: 'Mind & Beliefs' },
  { id: 'emotions', label: 'Emotions' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'mission', label: 'Mission & Purpose' },
  { id: 'money', label: 'Money & Finances' },
  { id: 'family', label: 'Family & Friends' },
  { id: 'lifestyle', label: 'Fun & Lifestyle' },
  { id: 'contribution', label: 'Contribution' },
  { id: 'spirituality', label: 'Spirituality' }
];

export function GoalBrainstorm({ data, onNext, onBack }: StepProps) {
  const {
    activeCategory,
    goals,
    newGoal,
    scores,
    handleAddGoal,
    handleRemoveGoal,
    handleCategoryClick,
    setNewGoal,
    handleSubmit,
    handleScoreChange
  } = useGoalBrainstorm(data, onNext);

  return (
    <StepContainer
      title="Brainstorm Your Goals"
      subtitle="Think freely about what you want to achieve in each area of your life"
      onSubmit={handleSubmit}
      onBack={onBack}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={(e) => handleCategoryClick(category.id, e)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-landing-green text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Goals Input */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <TextArea
              label={`Add a goal for ${categories.find(c => c.id === activeCategory)?.label}`}
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal..."
              minRows={2}
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className="flex items-center gap-2 text-landing-green hover:text-landing-green/80"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {goals[activeCategory]?.map((goal, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="flex-grow">
                  <p className="text-sm text-gray-900">{goal}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Believability:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scores[goal]?.believability || 10}
                        onChange={(e) => handleScoreChange(goal, 'believability', Number(e.target.value))}
                        className="flex-grow h-1 accent-landing-green"
                      />
                      <span className="text-xs text-gray-600">
                        {scores[goal]?.believability || 10}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600">Excitement:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scores[goal]?.excitement || 10}
                        onChange={(e) => handleScoreChange(goal, 'excitement', Number(e.target.value))}
                        className="flex-grow h-1 accent-landing-green"
                      />
                      <span className="text-xs text-gray-600">
                        {scores[goal]?.excitement || 10}/10
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(activeCategory, index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepContainer>
  );
}