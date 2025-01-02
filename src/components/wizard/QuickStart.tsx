import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface QuickStartProps {
  onComplete: () => void;
}

export function QuickStart({ onComplete }: QuickStartProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickStart = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const user = await getCurrentUser();
      console.log('Current user:', user);

      // Example goals in 3 key categories
      const exampleGoals = [
        {
          title: 'Exercise 3 times per week',
          category: 'health',
          type: 'monthly',
          completed: false,
          monthly_progress: {},
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          title: 'Read 12 books this year',
          category: 'mind',
          type: 'quantifiable',
          target: 12,
          progress: 0,
          unit: 'books',
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          title: 'Save 20% of monthly income',
          category: 'money',
          type: 'monthly',
          completed: false,
          monthly_progress: {},
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      console.log('Inserting example goals:', exampleGoals);

      // Save example goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .insert(exampleGoals)
        .select();

      if (goalsError) {
        console.error('Error saving goals:', goalsError);
        throw goalsError;
      }
      console.log('Goals saved successfully:', goalsData);

      // Call the mark_wizard_completed function
      const { data: wizardData, error: wizardError } = await supabase
        .rpc('mark_wizard_completed', {
          user_uuid: user.id
        });

      if (wizardError) {
        console.error('Error marking wizard as completed:', wizardError);
        throw wizardError;
      }
      console.log('Wizard completion marked successfully:', wizardData);

      onComplete();
    } catch (err) {
      console.error('Error in quick start:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up your goals. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Quick Start Setup
      </h2>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        We'll set you up with three example goals to get you started.
        You can customize them anytime later.
      </p>

      {error && (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleQuickStart}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Setting up your goals...
          </>
        ) : (
          'Start with Example Goals'
        )}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        You can always modify or delete these goals later
      </p>
    </div>
  );
} 