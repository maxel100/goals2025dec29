import React, { useState } from 'react';
import { AuthForm } from '../auth/AuthForm';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { GoalsBoardExample } from './GoalsBoardExample';
import { Testimonials } from './Testimonials';
import { LogoSlider } from './LogoSlider';
import { ComparisonSection } from './ComparisonSection';
import { AiCoachSection } from './AiCoachSection';

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthForm onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] relative overflow-hidden">
      {/* Hero Section with subtle gradient */}
      <div className="relative">
        <div className="hero-gradient" />
        <HeroSection onGetStarted={() => setShowAuth(true)} />
      </div>

      {/* Goals Board Example */}
      <div className="relative z-10 -mt-20 mb-32">
        <GoalsBoardExample />
      </div>

      {/* Logo Slider */}
      <div className="relative z-10 -mt-16">
        <LogoSlider />
      </div>

      {/* Rest of sections with gradient transitions */}
      <div className="gradient-fade">
        <ComparisonSection />
      </div>

      <div className="gradient-fade">
        <AiCoachSection />
      </div>

      <div className="gradient-fade">
        <HowItWorks />
      </div>

      <div className="gradient-fade">
        <Testimonials />
        
        <div className="relative z-10 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Ready to achieve your goals?
          </h2>
          <button
            onClick={() => setShowAuth(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-landing-purple to-landing-blue text-white px-8 py-4 rounded-lg font-medium hover:from-landing-purple/90 hover:to-landing-blue/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
}