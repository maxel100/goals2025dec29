import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PeriodSelectorProps {
  type: 'quarterly' | 'monthly';
  period: string;
  year: number;
  onChange: (period: string, year: number) => void;
}

export function PeriodSelector({ type, period, year, onChange }: PeriodSelectorProps) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const periods = type === 'quarterly' ? quarters : months;
  const currentPeriodIndex = periods.indexOf(period);

  const handlePrevious = () => {
    const newIndex = currentPeriodIndex - 1;
    if (newIndex < 0) {
      onChange(periods[periods.length - 1], year - 1);
    } else {
      onChange(periods[newIndex], year);
    }
  };

  const handleNext = () => {
    const newIndex = currentPeriodIndex + 1;
    if (newIndex >= periods.length) {
      onChange(periods[0], year + 1);
    } else {
      onChange(periods[newIndex], year);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-primary-50 rounded-lg p-3">
      <button
        onClick={handlePrevious}
        className="p-1 hover:bg-primary-100 rounded-full"
        aria-label="Previous period"
      >
        <ChevronLeft className="w-5 h-5 text-primary-600" />
      </button>
      
      <div className="text-center">
        <span className="font-medium text-primary-800">
          {period} {year}
        </span>
      </div>
      
      <button
        onClick={handleNext}
        className="p-1 hover:bg-primary-100 rounded-full"
        aria-label="Next period"
      >
        <ChevronRight className="w-5 h-5 text-primary-600" />
      </button>
    </div>
  );
}