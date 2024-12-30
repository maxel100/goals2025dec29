import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export type OnboardingMode = 'guided' | 'quick' | null;

export function useWizardState() {
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>(null);

  useEffect(() => {
    checkWizardState();
  }, []);

  const checkWizardState = async () => {
    try {
      const user = await getCurrentUser();
      
      // Check if user has any goals
      const { data: goals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      // Check wizard completion state
      const { data: wizardState } = await supabase
        .from('wizard_completion')
        .select('completed, onboarding_mode')
        .eq('user_id', user.id)
        .single();

      // Show wizard only if no goals and wizard not completed
      setShowWizard((!goals?.length && !wizardState?.completed) || false);
      setOnboardingMode(wizardState?.onboarding_mode as OnboardingMode || null);
    } catch (error) {
      console.error('Error checking wizard state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startOnboarding = async (mode: OnboardingMode) => {
    try {
      const user = await getCurrentUser();
      await supabase
        .from('wizard_completion')
        .upsert({
          user_id: user.id,
          completed: false,
          onboarding_mode: mode,
          started_at: new Date().toISOString()
        });
      setOnboardingMode(mode);
      setShowWizard(true);
    } catch (error) {
      console.error('Error starting onboarding:', error);
    }
  };

  const completeWizard = async () => {
    try {
      const user = await getCurrentUser();
      await supabase
        .from('wizard_completion')
        .upsert({
          user_id: user.id,
          completed: true,
          completed_at: new Date().toISOString()
        });
      setShowWizard(false);
      setOnboardingMode(null);
    } catch (error) {
      console.error('Error completing wizard:', error);
    }
  };

  return {
    showWizard,
    isLoading,
    onboardingMode,
    startOnboarding,
    completeWizard
  };
}