import React, { useState, useEffect } from 'react';
import { useMonthlyGoals } from '../hooks/useMonthlyGoals';
import { Loader2, Plus, ChevronLeft, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { AICoachModal } from './ai-coach/AICoachModal';
import { Checkbox } from './ui/Checkbox';

export function MonthlyGoals() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [newGoals, setNewGoals] = useState(['', '', '', '', '']);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { goals, isLoading, updateGoals } = useMonthlyGoals(selectedMonth);

  useEffect(() => {
    if (goals?.length) {
      setNewGoals([
        ...goals.map(g => g.text),
        ...Array(5 - goals.length).fill('')
      ]);
    }
  }, [isEditing, goals]);

  const handleSave = async () => {
    const validGoals = newGoals.filter(g => g.trim());
    if (validGoals.length > 0) {
      await updateGoals(validGoals);
      setIsEditing(false);
    }
  };

  const handleAddPriority = (priority: string) => {
    const updatedGoals = [...newGoals];
    const emptyIndex = updatedGoals.findIndex(g => !g.trim());
    if (emptyIndex >= 0) {
      updatedGoals[emptyIndex] = priority;
      setNewGoals(updatedGoals);
    } else {
      updatedGoals.pop();
      updatedGoals.push(priority);
      setNewGoals(updatedGoals);
    }
    setIsEditing(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(current => {
      const newDate = new Date(current);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthName = selectedMonth.toLocaleString('default', { month: 'long' });
  const year = selectedMonth.getFullYear();

  const handleDelete = (goalToDelete: string) => {
    const updatedGoals = goals?.filter(g => g.text !== goalToDelete) || [];
    updateGoals(updatedGoals.map(g => g.text));
  };

  if (isLoading) {
    return (
      <div className="bg-[#faf8ff] p-1 rounded-lg">
        <div className="flex justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8ff] p-1 rounded-lg">
      <div className="bg-[#faf8ff] rounded-lg shadow-sm border border-primary-100 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="font-medium">Monthly Goals</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-primary-50 rounded-full"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            <span className="text-sm text-gray-500 min-w-[140px] text-center">
              {monthName} {year}
            </span>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-primary-50 rounded-full"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {!isEditing && (!goals?.length) ? (
          <div className="space-y-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 px-4 border-2 border-dashed border-primary-200 rounded-lg text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto" />
              <span className="text-sm">Set goals for {monthName}</span>
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
            {goals?.map((goal) => (
              <div key={goal.id} className="group flex items-start gap-2">
                <Checkbox
                  checked={goal.completed}
                  onChange={() => updateGoals(goals.map(g => 
                    g.id === goal.id ? { ...g, completed: !g.completed } : g
                  ))}
                />
                <span className={`flex-grow text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {goal.text}
                </span>
                <button
                  onClick={() => handleDelete(goal.text)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-4 border-t pt-3">
              <button
                onClick={() => setIsEditing(true)}
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
          <AICoachModal
            onClose={() => setShowAICoach(false)}
            onAddPriority={handleAddPriority}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
}