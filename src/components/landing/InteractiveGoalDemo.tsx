import React, { useState } from 'react';

interface GoalDemoState {
  savings: number;
  months: string[];
}

export function InteractiveGoalDemo() {
  const [state, setState] = useState<GoalDemoState>({
    savings: 35000,
    months: ['Jan', 'Feb', 'Mar']
  });

  const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      savings: Number(e.target.value) * 500
    }));
  };

  const handleMonthClick = (month: string) => {
    setState(prev => ({
      ...prev,
      months: prev.months.includes(month)
        ? prev.months.filter(m => m !== month)
        : [...prev.months, month]
    }));
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  const savingsProgress = (state.savings / 50000) * 100;
  const monthsProgress = (state.months.length / 12) * 100;
  const totalProgress = Math.round((savingsProgress + monthsProgress) / 2);

  return (
    <div className="space-y-4">
      {/* Total Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Goals Progress</span>
          <span>{totalProgress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-landing-purple to-landing-blue rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* Savings Goal */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Savings Goal: ${state.savings.toLocaleString()}</span>
          <span>{Math.round(savingsProgress)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={state.savings / 500}
          onChange={handleSavingsChange}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-purple [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      {/* Monthly Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Monthly Progress</span>
          <span>{Math.round(monthsProgress)}%</span>
        </div>
        <div className="flex gap-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => handleMonthClick(month)}
              className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                state.months.includes(month)
                  ? 'bg-gradient-to-r from-landing-purple to-landing-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}