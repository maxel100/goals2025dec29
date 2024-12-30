import React, { useEffect } from 'react';
import { useYearName } from '../../../hooks/useYearName';
import { useWizardCompletion } from '../../../hooks/useWizardCompletion';
import { Target, Calendar } from 'lucide-react';
import { CelebrationElements } from '../../ui/CelebrationElements';

export function FinalStep() {
  const { yearName, updateYearName } = useYearName();
  const markCompleted = useWizardCompletion(state => state.markCompleted);
  const [name, setName] = React.useState(yearName);

  useEffect(() => {
    markCompleted();
  }, [markCompleted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    updateYearName(e.target.value);
  };

  return (
    <div className="relative">
      {/* Background Celebration Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-100">
        <CelebrationElements />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full animate-bounce">
            <Target className="w-10 h-10 text-landing-green" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            You're all set! 🎉
          </h1>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            Your goals board is ready. Break down your goals into actionable steps using the daily, weekly, and monthly priorities.
          </p>
        </div>

        {/* Name Input */}
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name Your Goals Board
          </label>
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="e.g., My Best Year Yet"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Priorities Explanation */}
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-yellow-600" />
              <h3 className="font-medium text-yellow-900">How to Use Priorities</h3>
            </div>
            <p className="text-yellow-800 text-sm leading-relaxed mb-4">
              Use the priorities sections to break down your goals into smaller, manageable tasks:
            </p>
            <ul className="space-y-3 text-sm text-yellow-800">
              <li className="flex items-center gap-3 bg-yellow-100/50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Daily priorities for immediate actions</span>
              </li>
              <li className="flex items-center gap-3 bg-yellow-100/50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Weekly priorities for short-term objectives</span>
              </li>
              <li className="flex items-center gap-3 bg-yellow-100/50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Monthly priorities for bigger milestones</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}