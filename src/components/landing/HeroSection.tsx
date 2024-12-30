import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { SuccessGraph } from './SuccessGraph';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-visible -z-10" style={{ height: '150%' }}>
        {/* Primary gradient circle */}
        <div 
          className="absolute w-[1200px] h-[1200px] animate-float"
          style={{
            background: 'radial-gradient(circle at center, rgba(216,180,254,0.4) 0%, rgba(216,180,254,0.2) 45%, rgba(216,180,254,0) 70%)',
            filter: 'blur(100px)',
            transform: 'translate(-25%, -25%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        {/* Secondary gradient circle */}
        <div 
          className="absolute w-[1000px] h-[1000px] animate-float-delayed"
          style={{
            background: 'radial-gradient(circle at center, rgba(147,197,253,0.3) 0%, rgba(216,180,254,0.2) 50%, rgba(216,180,254,0) 75%)',
            filter: 'blur(80px)',
            transform: 'translate(50%, -15%)',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        />
        {/* Gradient fade to white */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 70%, white 100%)',
            transform: 'translateY(50%)',
            height: '100%'
          }}
        />
      </div>

      {/* Background with glows */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute -left-1/4 top-0 w-[1000px] h-[800px]"
          style={{
            background: 'radial-gradient(circle at center, rgba(245,243,255,0.7) 0%, rgba(245,243,255,0) 70%)',
            transform: 'translate(-15%, -45%)',
          }}
        />
        <div 
          className="absolute right-0 top-0 w-[1000px] h-[800px]"
          style={{
            background: 'radial-gradient(circle at center, rgba(239,246,255,0.7) 0%, rgba(239,246,255,0) 70%)',
            transform: 'translate(25%, -45%)',
          }}
        />
      </div>

      {/* Animated Success Graph */}
      <SuccessGraph />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center z-10">
        <div className="animate-subtle-pulse inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-landing-purple" />
          <span className="text-landing-purple text-xs font-medium">Scientifically Proven</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight">
          Turn Your Goals Into <span className="bg-gradient-to-r from-landing-purple to-landing-blue bg-clip-text text-transparent italic">Reality</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          with our scientifically-proven goals board making you 53% more likely to succeed
        </p>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Smart tracking • AI coach • Social accountability
        </p>

        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-landing-purple to-landing-blue text-white px-8 py-4 rounded-lg font-medium hover:from-landing-purple/90 hover:to-landing-blue/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Get Started Free
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}