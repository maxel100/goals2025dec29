import React from 'react';

export function GoalsBoardExample() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-landing-blue/10 rounded-full opacity-50 blur-2xl" />
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-landing-blue/10 rounded-full opacity-50 blur-2xl" />
      
      {/* Image container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl" />
        <img
          src="https://i.ibb.co/QjRs2xH/image.png"
          alt="AI Goals Board Example"
          className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.15)] border-4 border-white"
          style={{
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 0 0 2px rgba(59, 130, 246, 0.1),
              0 20px 50px rgba(59, 130, 246, 0.15)
            `
          }}
        />
        
        {/* Floating badge */}
        <div className="absolute -top-3 -right-3 bg-purple-200/70 text-gray-600 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
          Live Example
        </div>
      </div>
    </div>
  );
}