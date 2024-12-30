import React from 'react';
import { BookOpen } from 'lucide-react';
import { useReflection } from '../hooks/useReflection';
import { EditableSection } from './ui/EditableSection';

export function YearlyReflection() {
  const { debrief, isLoading, saveDebrief } = useReflection();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
          <BookOpen className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Yearly Reflection</h2>
      </div>

      <EditableSection
        title="Your Journey"
        fields={[
          {
            label: "Wins & Successes",
            value: debrief?.wins || '',
            name: 'wins'
          },
          {
            label: "Challenges Faced",
            value: debrief?.challenges || '',
            name: 'challenges'
          }
        ]}
        onSave={saveDebrief}
      />
    </div>
  );
}