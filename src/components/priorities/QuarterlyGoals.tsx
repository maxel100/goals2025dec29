import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useQuarterlyGoals } from '../../hooks/useQuarterlyGoals';
import { QuarterlyAICoachModal } from '../ai-coach/QuarterlyAICoachModal';

export function QuarterlyGoals() {
  const [selectedQuarter, setSelectedQuarter] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [newGoals, setNewGoals] = useState(['', '', '', '', '']);
  const { goals, isLoading, updateGoals, updateGoal, toggleVisibility } = useQuarterlyGoals(selectedQuarter);

  const handleSave = () => {
    const validGoals = newGoals.filter(g => g.trim()).map(text => ({
      id: crypto.randomUUID(),
      text,
      completed: false,
    }));
    if (validGoals.length > 0) {
      updateGoals(validGoals);
      setIsEditing(false);
    }
  };

  const handleAddGoal = (goal: string) => {
    const currentGoals = goals?.goals || [];
    updateGoals([...currentGoals, {
      id: crypto.randomUUID(),
      text: goal,
      completed: false,
    }]);
  };

  const handleDelete = (goalId: string) => {
    if (!goals) return;
    const updatedGoals = goals.goals.filter(g => g.id !== goalId);
    updateGoals(updatedGoals);
  };

  const navigateQuarter = (direction: 'prev' | 'next') => {
    setSelectedQuarter(current => {
      const newDate = new Date(current);
      const months = direction === 'prev' ? -3 : 3;
      newDate.setMonth(newDate.getMonth() + months);
      return newDate;
    });
  };

  const formatQuarterLabel = (date: Date) => {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${date.getFullYear()}`;
  };

  if (!goals?.is_visible) {
    return (
      <button
        onClick={() => toggleVisibility(true)}
        className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <Eye className="w-4 h-4" />
        <span>Show Quarterly Goals</span>
      </button>
    );
  }

  return (
    <div className="bg-[#faf8ff] p-1 rounded-lg">
      <div className="bg-[#faf8ff] rounded-lg shadow-sm border border-primary-100 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h3 className="font-medium text-gray-900">Quarterly Goals</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => navigateQuarter('prev')}
              className="p-1 hover:bg-primary-50 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <span className="text-sm text-gray-500 min-w-[140px] text-center">
              {formatQuarterLabel(selectedQuarter)}
            </span>
            <button
              onClick={() => navigateQuarter('next')}
              className="p-1 hover:bg-primary-50 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => toggleVisibility(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-primary-50"
              title="Hide quarterly goals"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {!isEditing && (!goals?.goals || goals.goals.length === 0) ? (
            <div className="space-y-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2 px-4 border-2 border-dashed border-primary-200 rounded-lg text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-5 h-5 mx-auto" />
                <span className="text-sm">Set goals for this quarter</span>
              </button>
              <button
                onClick={() => setShowAICoach(true)}
                className="w-full py-2 px-4 border-2 border-dashed border-primary-200 rounded-lg text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">Get AI suggestions</span>
              </button>
            </div>
          ) : isEditing ? (
            <div className="space-y-3">
              {newGoals.map((goal, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => {
                      const updated = [...newGoals];
                      updated[index] = e.target.value;
                      setNewGoals(updated);
                    }}
                    placeholder={`Goal ${index + 1}`}
                    className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="absolute right-2 top-2 text-xs text-gray-400">
                    {index + 1}/5
                  </span>
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAICoach(true)}
                  className="px-3 py-1 text-sm bg-yellow-100 text-gray-900 border border-yellow-400 rounded-md hover:bg-yellow-200 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Get suggestions
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {goals?.goals.map((goal) => (
                <div key={goal.id} className="group flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => updateGoal(goal.id, !goal.completed)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className={`flex-grow text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {goal.text}
                  </span>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-opacity"
                    title="Delete goal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-3 mt-4 border-t pt-3">
                <button
                  onClick={() => {
                    if (goals) {
                      setNewGoals([
                        ...goals.goals.map(g => g.text),
                        ...Array(5 - goals.goals.length).fill('')
                      ]);
                    }
                    setIsEditing(true);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Edit goals
                </button>
                <div className="h-4 w-px bg-gray-200" />
                <button
                  onClick={() => setShowAICoach(true)}
                  className="text-sm bg-yellow-50 text-gray-900 border border-yellow-200 rounded-md hover:bg-yellow-100 px-3 py-1.5 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Get suggestions
                </button>
              </div>
            </div>
          )}

          {showAICoach && (
            <QuarterlyAICoachModal
              onClose={() => setShowAICoach(false)}
              onAddGoal={handleAddGoal}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
} 