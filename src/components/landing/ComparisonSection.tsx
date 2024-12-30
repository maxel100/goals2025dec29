import React from 'react';
import { InteractiveGoalDemo } from './InteractiveGoalDemo';
import { NotesAppMockup } from './NotesAppMockup';
import { X, Check } from 'lucide-react';

export function ComparisonSection() {
  return (
    <div className="py-24 bg-white">
      <div 
        className="absolute top-0 left-0 w-full h-[50%]"
        style={{
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          transform: 'scale(1.5)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Time to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-landing-purple to-landing-blue bg-clip-text text-transparent">upgrade</span>
              <svg 
                className="absolute -bottom-2 left-0 w-full h-4 z-0" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
              >
                <path 
                  d="M0,10 Q25,0 50,10 T100,10"
                  stroke="url(#gradient-line)" 
                  strokeWidth="3" 
                  fill="none"
                />
                <defs>
                  <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {' '}your goal tracking
          </h2>
          <p className="text-xl text-gray-600">
            Experience the difference with our interactive goals board
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Traditional Methods Side */}
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-400">The Old Way</h3>
            </div>
            <div className="relative mb-8">
              <NotesAppMockup />
              <div className="absolute -bottom-4 left-0 right-0 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                ⚠️ Don't use a notes app for goal tracking!
              </div>
            </div>
          </div>

          {/* Interactive Goals Board Side */}
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-landing-purple to-landing-blue bg-clip-text text-transparent">AI Goals Board</h3>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Interactive Demo</h3>
                <div className="bg-landing-purple/10 text-landing-purple text-sm px-3 py-1 rounded-full border border-landing-purple/20">
                  53% more likely to succeed
                </div>
              </div>
              <InteractiveGoalDemo />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-2 gap-8">
            {/* Traditional Methods */}
            <div>
              <h4 className="text-center text-gray-400 font-medium mb-6">Traditional Methods</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">Static lists that get forgotten</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">No progress tracking or insights</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">Zero accountability or motivation</span>
                </div>
              </div>
            </div>

            {/* AI Goals Board */}
            <div>
              <h4 className="text-center bg-gradient-to-r from-landing-purple to-landing-blue bg-clip-text text-transparent font-medium mb-6">AI Goals Board</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-landing-purple/5 rounded-lg border border-landing-purple/20">
                  <Check className="w-5 h-5 text-landing-purple flex-shrink-0" />
                  <span className="text-landing-purple">Interactive progress tracking with charts</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-landing-purple/5 rounded-lg border border-landing-purple/20">
                  <Check className="w-5 h-5 text-landing-purple flex-shrink-0" />
                  <span className="text-landing-purple">AI-powered insights and guidance</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-landing-purple/5 rounded-lg border border-landing-purple/20">
                  <Check className="w-5 h-5 text-landing-purple flex-shrink-0" />
                  <span className="text-landing-purple">Built-in accountability and motivation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}