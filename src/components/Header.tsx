import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Brain, Star, Bot } from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import { WeeklyPriorities } from './priorities/WeeklyPriorities';
import { MonthlyGoals } from './MonthlyGoals';
import { DailyPriorities } from './priorities/DailyPriorities';
import { InternalTalk } from './dropdowns/InternalTalk';
import { RulesOfSuccess } from './dropdowns/RulesOfSuccess';
import { WeeklyMotivation } from './WeeklyMotivation';
import { QuarterlyGoals } from './priorities/QuarterlyGoals';
import { useQuarterlyGoals } from '../hooks/useQuarterlyGoals';

interface HeaderProps {
  totalProgress: number;
}

export function Header({ totalProgress }: HeaderProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { goals: quarterlyGoals } = useQuarterlyGoals();

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="mb-8">
      {/* Controls section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'internal', title: 'My Internal Talk', icon: <Brain className="w-5 h-5 text-purple-500" /> },
            { id: 'rules', title: 'My Rules of Success', icon: <Star className="w-5 h-5 text-purple-400" /> },
            { id: 'ai-coach', title: 'Your AI Coach', icon: <Bot className="w-5 h-5 text-purple-600" /> }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`
                p-4 text-base font-medium text-center
                bg-white rounded-xl shadow-sm border border-gray-300
                transition-all hover:shadow-md hover:border-primary-200
                ${activeSection === section.id ? 'bg-primary-50 border-primary-200 shadow-md' : ''}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{section.title}</span>
                <span>{section.icon}</span>
                {activeSection === section.id ? (
                  <ChevronUp className="w-4 h-4 text-primary-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        {activeSection && (
          <div className="bg-white rounded-xl shadow-md border border-gray-300 transition-all overflow-hidden">
            {activeSection === 'internal' && <InternalTalk />}
            {activeSection === 'rules' && <RulesOfSuccess />}
            {activeSection === 'ai-coach' && <WeeklyMotivation />}
          </div>
        )}

        {/* Priorities Grid */}
        <div className={`grid grid-cols-1 ${quarterlyGoals?.is_visible ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
          <DailyPriorities />
          <WeeklyPriorities />
          <MonthlyGoals />
          {quarterlyGoals?.is_visible && <QuarterlyGoals />}
        </div>
        
        {/* Progress Bar */}
        <div className="bg-blue-50/30 rounded-xl shadow-sm border border-blue-200 p-4 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Stars */}
            <svg className="absolute top-2 left-4 w-5 h-5 text-yellow-300 animate-sparkle" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg className="absolute top-6 right-8 w-4 h-4 text-yellow-300 animate-sparkle-delayed" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg className="absolute bottom-4 left-1/4 w-5 h-5 text-yellow-300 animate-sparkle-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg className="absolute top-2 left-1/3 w-4 h-4 text-yellow-300 animate-sparkle" style={{ animationDelay: '1.2s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg className="absolute bottom-3 right-1/4 w-4 h-4 text-yellow-300 animate-sparkle-delayed" style={{ animationDelay: '0.7s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            
            {/* Trophies */}
            <svg className="absolute top-4 right-1/3 w-6 h-6 text-yellow-300 animate-sparkle" style={{ animationDelay: '1.5s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 10.43V2H7v8.43c0 .35.18.68.47.86l4.72 2.86-.78 3.14H7.78C6.8 17.29 6 18.09 6 19.07V20h12v-.93c0-.98-.8-1.78-1.78-1.78h-3.63l-.78-3.14 4.72-2.86c.29-.18.47-.51.47-.86z" />
            </svg>
            <svg className="absolute bottom-2 right-12 w-6 h-6 text-yellow-300 animate-sparkle-pulse" style={{ animationDelay: '2s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 10.43V2H7v8.43c0 .35.18.68.47.86l4.72 2.86-.78 3.14H7.78C6.8 17.29 6 18.09 6 19.07V20h12v-.93c0-.98-.8-1.78-1.78-1.78h-3.63l-.78-3.14 4.72-2.86c.29-.18.47-.51.47-.86z" />
            </svg>
            <svg className="absolute top-3 left-16 w-5 h-5 text-yellow-300 animate-sparkle-delayed" style={{ animationDelay: '0.3s' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 10.43V2H7v8.43c0 .35.18.68.47.86l4.72 2.86-.78 3.14H7.78C6.8 17.29 6 18.09 6 19.07V20h12v-.93c0-.98-.8-1.78-1.78-1.78h-3.63l-.78-3.14 4.72-2.86c.29-.18.47-.51.47-.86z" />
            </svg>
          </div>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gray-900" />
                <h3 className="text-sm font-medium text-gray-900">Your Dream Year Progress</h3>
              </div>
              <span className="text-lg font-bold text-gray-900">{totalProgress}%</span>
            </div>
            <ProgressBar progress={totalProgress} size="sm" showLabel={false} />
          </div>
        </div>
      </div>
    </div>
  );
}