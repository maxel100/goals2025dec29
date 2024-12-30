import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { useNavigate } from '../../hooks/useNavigate';

interface LoadingScreenProps {
  message?: string;
  showNewUserOption?: boolean;
}

export function LoadingScreen({ 
  message = 'Loading your goals...', 
  showNewUserOption = false 
}: LoadingScreenProps) {
  const { navigateToOnboarding } = useNavigate();
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    if (showNewUserOption) {
      const timer = setTimeout(() => {
        setShowGetStarted(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNewUserOption]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGetStarted = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500 to-blue-600 flex flex-col items-center justify-center gap-6 z-50">
      {/* Sparkling Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[20%] left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[15%] right-[15%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] right-[25%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>

      <div className="flex items-center gap-3 animate-pulse">
        <Sparkles className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold text-white">AI Goals Board</h1>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
          <p className="text-white/90">{message}</p>
        </div>

        {showNewUserOption && showGetStarted && (
          <button
            onClick={handleGetStarted}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-colors shadow-md"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}