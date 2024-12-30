import React from 'react';
import { StepProps } from '../types';
import { StepContainer } from '../ui/StepContainer';
import { Check } from 'lucide-react';

export function ReviewGoals({ data, onNext, onBack }: StepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <StepContainer
      title="Review Your Journey"
      subtitle="Let's review everything before creating your personalized goals board"
      onSubmit={handleSubmit}
      onBack={onBack}
      isLast
    >
      <div className="space-y-8">
        {/* Vision */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Vision</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{data.mission?.vision}</p>
          </div>
        </section>

        {/* Goals Summary */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.goals || {}).map(([category, goals]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 capitalize">{category}</h4>
                <ul className="space-y-2">
                  {(goals as string[]).map((goal, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-landing-green mt-1 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Talk */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Mindset</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Internal Talk</h4>
              <ul className="space-y-2">
                {data.internalTalk?.map((talk: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-landing-green mt-1 flex-shrink-0" />
                    <span>{talk}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Patterns to Avoid</h4>
              <ul className="space-y-2">
                {data.avoidance?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-landing-green mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </StepContainer>
  );
}