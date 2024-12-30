import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { generateDailyPriorities } from '../../services/aiCoach';

interface DailyAICoachModalProps {
  onClose: () => void;
  onAddPriority: (priority: string) => void;
  setIsEditing: (editing: boolean) => void;
}

export function DailyAICoachModal({ onClose, onAddPriority, setIsEditing }: DailyAICoachModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        setIsEditing(true);
        const suggestions = await generateDailyPriorities();
        setSuggestions(suggestions);
        setIsLoading(false);
      } catch (err) {
        console.error('Error generating suggestions:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [setIsEditing]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Daily Priority Coach
          </h2>
          <p className="text-gray-600 mb-6">
            Based on your weekly priorities and past daily actions, here are suggested priorities for today:
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <p className="text-gray-600 text-center">
                Analyzing your goals and crafting daily priorities...
                <br />
                <span className="text-sm text-gray-500">This might take up to 10 seconds</span>
              </p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors group"
                >
                  <p className="text-gray-700 flex-grow">{suggestion}</p>
                  <button
                    onClick={() => {
                      onAddPriority(suggestion);
                      onClose();
                    }}
                    className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 