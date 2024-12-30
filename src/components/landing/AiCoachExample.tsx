import React from 'react';
import { Brain } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  example: {
    title: string;
    progress: string;
    insight: string;
    steps: string[];
  };
}

interface Props {
  activeFeature: string;
  features: Feature[];
}

export function AiCoachExample({ activeFeature, features }: Props) {
  const activeExample = features.find(f => f.id === activeFeature)?.example;

  if (!activeExample) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden">
      <div className="p-4 bg-primary-50 border-b border-primary-100 flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Brain className="w-5 h-5 text-primary-600" />
        </div>
        <span className="font-medium text-primary-900">Weekly Progress Review</span>
      </div>
      
      <div className="p-6">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <p className="text-gray-700">
              {activeExample.progress}
            </p>
            
            <p className="text-gray-700">
              {activeExample.insight}
            </p>

            <div className="bg-primary-50 p-4 rounded-lg space-y-2">
              <p className="font-medium text-primary-800">Suggested next steps:</p>
              <ul className="space-y-2 text-primary-700">
                {activeExample.steps.map((step, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}