import React, { useState } from 'react';
import { Loader2, Plus, ChevronLeft, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { useWeeklyPriorities } from '../../hooks/useWeeklyPriorities';
import { startOfWeek, formatDate, addWeeks } from '../../utils/date';
import { WeeklyAICoachModal } from '../ai-coach/WeeklyAICoachModal';

export function WeeklyPriorities() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [newPriorities, setNewPriorities] = useState(['', '', '', '', '']);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { priorities, isLoading, updatePriority, setPrioritiesForWeek } = useWeeklyPriorities(selectedWeek);

  const handleSave = () => {
    const validPriorities = newPriorities.filter(p => p.trim());
    if (validPriorities.length > 0) {
      setPrioritiesForWeek(validPriorities);
      setIsEditing(false);
    }
  };

  const handleAddPriority = (priority: string) => {
    const currentPriorities = priorities?.priorities || [];
    setPrioritiesForWeek([...currentPriorities.map(p => p.text), priority]);
  };

  const handleDelete = (priorityId: string) => {
    const updatedPriorities = priorities?.priorities.filter(p => p.id !== priorityId) || [];
    setPrioritiesForWeek(updatedPriorities.map(p => p.text));
  };

  const startEditing = () => {
    const existingPriorities = priorities?.priorities || [];
    setNewPriorities([
      ...existingPriorities.map(p => p.text),
      ...Array(5 - existingPriorities.length).fill('')
    ]);
    setIsEditing(true);
  };

  const startDate = startOfWeek(selectedWeek);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(current => {
      const weeks = direction === 'prev' ? -1 : 1;
      return addWeeks(current, weeks);
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[#faf8ff] p-1 rounded-lg">
        <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-3 sm:p-4">
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8ff] p-1 rounded-lg">
      <div className="bg-[#faf8ff] rounded-lg shadow-sm border border-primary-100 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="font-medium">Weekly Priorities</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-1 hover:bg-primary-50 rounded-full"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            <span className="text-sm text-gray-500 min-w-[140px] text-center">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-1 hover:bg-primary-50 rounded-full"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {!isEditing && (!priorities?.priorities || priorities.priorities.length === 0) ? (
          <div className="space-y-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 px-4 border-2 border-dashed border-primary-200 rounded-lg text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto" />
              <span className="text-sm">Set priorities for this week</span>
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
            {newPriorities.map((priority, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => {
                    const updated = [...newPriorities];
                    updated[index] = e.target.value;
                    setNewPriorities(updated);
                  }}
                  placeholder={`Priority ${index + 1}`}
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
            {priorities?.priorities.map((priority) => (
              <div key={priority.id} className="group flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={priority.completed}
                  onChange={() => updatePriority(priority.id, !priority.completed)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className={`flex-grow text-sm ${priority.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {priority.text}
                </span>
                <button
                  onClick={() => handleDelete(priority.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                  title="Delete priority"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-4 border-t pt-3">
              <button
                onClick={startEditing}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Edit priorities
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
          <WeeklyAICoachModal
            onClose={() => setShowAICoach(false)}
            onAddPriority={handleAddPriority}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
}