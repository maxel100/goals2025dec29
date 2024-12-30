import React, { useState, useEffect } from 'react';
import { useAiCoachGoals } from '../../hooks/useAiCoachGoals';
import { Loader2, Plus, Save } from 'lucide-react';
import { PeriodSelector } from './PeriodSelector';

interface GoalTimeframeProps {
  title: string;
  description: string;
  timeframe: 'five_year' | 'one_year' | 'quarterly' | 'monthly';
}

export function GoalTimeframe({ title, description, timeframe }: GoalTimeframeProps) {
  const currentYear = new Date().getFullYear();
  const [goals, setGoals] = useState<string[]>(['']);
  const [importance, setImportance] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [period, setPeriod] = useState(timeframe === 'quarterly' ? 'Q1' : 'January');
  const [year, setYear] = useState(currentYear);
  
  const { data, isLoading, saveGoals } = useAiCoachGoals(timeframe, period, year);

  useEffect(() => {
    if (data) {
      setGoals(data.goals as string[]);
      setImportance(data.importance || '');
    }
  }, [data]);

  const handlePeriodChange = (newPeriod: string, newYear: number) => {
    setPeriod(newPeriod);
    setYear(newYear);
  };

  const handleSave = async () => {
    const filteredGoals = goals.filter(goal => goal.trim());
    if (filteredGoals.length > 0) {
      await saveGoals(filteredGoals, importance, period, year);
      setIsEditing(false);
    }
  };

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      {(timeframe === 'quarterly' || timeframe === 'monthly') && (
        <PeriodSelector
          type={timeframe}
          period={period}
          year={year}
          onChange={handlePeriodChange}
        />
      )}

      {isEditing ? (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <input
              key={index}
              type="text"
              value={goal}
              onChange={(e) => {
                const newGoals = [...goals];
                newGoals[index] = e.target.value;
                setGoals(newGoals);
              }}
              placeholder={`Goal ${index + 1}`}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          ))}

          <button
            onClick={addGoal}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Plus size={20} />
            Add another goal
          </button>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are these goals important to you?
            </label>
            <textarea
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe why achieving these goals matters to you..."
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <Save size={20} />
              Save Goals
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.filter(Boolean).length > 0 ? (
            <>
              <ul className="space-y-2">
                {goals.filter(Boolean).map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary-500">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
              {importance && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-medium text-primary-700 mb-2">Why this matters:</h4>
                  <p className="text-primary-800">{importance}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No goals set yet</p>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 text-primary-600 hover:text-primary-700"
          >
            {goals.filter(Boolean).length > 0 ? 'Edit Goals' : 'Set Goals'}
          </button>
        </div>
      )}
    </div>
  );
}