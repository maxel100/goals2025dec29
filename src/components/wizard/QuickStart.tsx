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
        console.error('Error inserting goals:', goalsError);
        throw goalsError;
      }
      console.log('Goals inserted successfully:', goalsData);

      // Create or update life mission
      const { data: missionData, error: missionError } = await supabase
        .from('life_mission')
        .upsert({
          user_id: user.id,
          vision: 'Living a balanced and fulfilling life',
          importance: 'To achieve personal growth and make a positive impact',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (missionError) {
        console.error('Error upserting life mission:', missionError);
        throw missionError;
      }
      console.log('Life mission upserted successfully:', missionData);

      // Create or update yearly debrief
      const { data: debriefData, error: debriefError } = await supabase
        .from('yearly_debrief')
        .upsert({
          user_id: user.id,
          wins: 'Starting my goals journey',
          challenges: 'Building new habits',
          lessons: 'Taking consistent action leads to progress',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (debriefError) {
        console.error('Error upserting yearly debrief:', debriefError);
        throw debriefError;
      }
      console.log('Yearly debrief upserted successfully:', debriefData);

      // Mark wizard as completed
      const { data: wizardData, error: wizardError } = await supabase
        .from('wizard_completion')
        .upsert({
          user_id: user.id,
          completed: true,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

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