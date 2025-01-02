import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { generateQuarterlyGoals } from '../../services/aiCoach';

interface QuarterlyAICoachModalProps {
  onClose: () => void;
  onAddGoal: (goal: string) => void;
  setIsEditing: (editing: boolean) => void;
}

export function QuarterlyAICoachModal({ onClose, onAddGoal, setIsEditing }: QuarterlyAICoachModalProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const generatedSuggestions = await generateQuarterlyGoals();
        setSuggestions(generatedSuggestions);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Plus className="w-5 h-5 text-primary-600" />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col min-h-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 shrink-0">
            Quarterly Goals Coach
          </h2>
          <p className="text-gray-600 mb-6 shrink-0">
            Based on your yearly goals and past performance, here are suggested goals for this quarter:
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <p className="text-gray-600 text-center">
                Analyzing your goals and crafting quarterly objectives...
                <br />
                <span className="text-sm text-gray-500">This might take up to 10 seconds</span>
              </p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">
              {error}
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50 transition-colors group"
                >
                  <p className="text-gray-700 flex-grow">{suggestion}</p>
                  <button
                    onClick={() => {
                      onAddGoal(suggestion);
                      onClose();
                    }}
                    className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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