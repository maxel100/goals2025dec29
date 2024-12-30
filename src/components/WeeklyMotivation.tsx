import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMotivation } from '../hooks/useMotivation';
import { startOfWeek, addWeeks, formatDate } from '../utils/date';

export function WeeklyMotivation() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const { generateMotivation, currentMotivation, loadMotivation, isLoading, error } = useMotivation();

  const handleRefresh = async () => {
    await generateMotivation(selectedWeek, true);
  };

  const navigateWeek = async (direction: 'prev' | 'next') => {
    const newDate = addWeeks(selectedWeek, direction === 'prev' ? -1 : 1);
    setSelectedWeek(newDate);
    await loadMotivation(newDate);
  };

  useEffect(() => {
    const loadInitialMotivation = async () => {
      const existing = await loadMotivation(selectedWeek);
      if (!existing) {
        await generateMotivation(selectedWeek);
      }
    };
    
    loadInitialMotivation();
  }, [selectedWeek]);

  const weekStart = startOfWeek(selectedWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">Your Weekly AI Coach</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 hover:bg-primary-50 rounded-full"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              
              <span className="text-sm text-gray-500 min-w-[140px] text-center">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
              </span>
              
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 hover:bg-primary-50 rounded-full"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
              aria-label="Refresh motivation"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : currentMotivation ? (
          <div className="prose prose-primary max-w-none">
            {currentMotivation.split('\n').map((line, i) => (
              line.trim() ? <p key={i} className="mb-4 last:mb-0">{line}</p> : null
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}