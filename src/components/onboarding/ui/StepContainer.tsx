import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function StepContainer({
  title,
  subtitle,
  children,
  onSubmit,
  onBack,
  isFirst,
  isLast
}: StepContainerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        {!isFirst && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="space-y-6">
        {children}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-landing-green text-white px-6 py-2 rounded-lg font-medium hover:bg-landing-green/90 transition-colors"
          >
            {isLast ? 'Create Goals Board' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}