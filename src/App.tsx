import React from 'react';
import { Header } from './components/Header';
import { TopBar } from './components/TopBar';
import { useGoals } from './hooks/useGoals';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/landing/LandingPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WelcomeWizard } from './components/wizard/WelcomeWizard';
import { ReflectionsPanel } from './components/ReflectionsPanel';
import { useWizardState } from './hooks/useWizardState';
import { AuthCallback } from './components/auth/AuthCallback';
import { PasswordReset } from './components/auth/PasswordReset';
import { CategoryGrid } from './components/CategoryGrid';

export default function App() {
  const { isLoading: isAuthLoading, error: authError, session } = useAuth();
  const { groupedGoals, updateGoal, totalProgress, isLoading: isGoalsLoading, error: goalsError } = useGoals();
  const { showWizard, isLoading: isWizardLoading, completeWizard } = useWizardState();

  // Handle auth callback route
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  // Handle password reset route
  if (window.location.hash.includes('type=recovery')) {
    return <PasswordReset />;
  }

  if (isAuthLoading || isWizardLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <LandingPage />;
  }

  const error = authError || goalsError;
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading goals</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col">
        <TopBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Header totalProgress={totalProgress} />
          
          <CategoryGrid 
            groupedGoals={groupedGoals}
            onUpdateGoal={updateGoal}
          />

          <ReflectionsPanel />
        </div>
      </div>

      {showWizard && (
        <WelcomeWizard onClose={completeWizard} />
      )}
    </div>
  );
}