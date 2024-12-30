import React, { useState } from 'react';
import { AiCoachExample } from './AiCoachExample';
import { Brain, Target, Calendar, LineChart } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  example: {
    title: string;
    progress: string;
    insight: string;
    steps: string[];
  };
}

export function AiCoachSection() {
  const [activeFeature, setActiveFeature] = useState('insights');

  const features: Feature[] = [
    {
      id: 'insights',
      title: 'Smart Insights',
      description: 'AI-powered goal analysis',
      icon: Brain,
      example: {
        title: "Goal Analysis",
        progress: "Your language learning is progressing well! 🎯",
        insight: "Based on your study patterns, you're most focused in the morning. Consider scheduling more practice sessions before noon.",
        steps: [
          "Schedule morning study blocks",
          "Join language exchange group",
          "Set up progress milestones"
        ]
      }
    },
    {
      id: 'alignment',
      title: 'Goal Alignment',
      description: 'Keep goals balanced & achievable',
      icon: Target,
      example: {
        title: "Goal Balance Check",
        progress: "Your goals are well-distributed across life areas 🌟",
        insight: "Your health and career goals complement each other well. The morning exercise routine is giving you more energy at work.",
        steps: [
          "Maintain current balance",
          "Consider adding a learning goal",
          "Review monthly targets"
        ]
      }
    },
    {
      id: 'reviews',
      title: 'Weekly Reviews',
      description: 'Regular check-ins to keep you on track',
      icon: Calendar,
      example: {
        title: "Weekly Check-in",
        progress: "Great week for your fitness goals! You've hit the gym 4 times and improved your lifts by 5%. 💪",
        insight: "Your consistency with morning workouts is paying off. The data shows you have more energy throughout the day when you exercise early.",
        steps: [
          "Book next week's morning sessions",
          "Review your nutrition plan",
          "Set new PR targets for next month"
        ]
      }
    },
    {
      id: 'next',
      title: 'Next Steps',
      description: 'Clear actions based on your progress',
      icon: LineChart,
      example: {
        title: "Action Plan",
        progress: "You're 65% towards your savings goal, ahead of schedule! 📈",
        insight: "Your automated transfers have been crucial. Let's optimize your strategy based on recent spending patterns.",
        steps: [
          "Increase automated savings by 5%",
          "Review and cancel unused subscriptions",
          "Schedule quarterly investment rebalancing"
        ]
      }
    }
  ];

  return (
    <div className="py-24 relative overflow-hidden bg-white">
      {/* Large centered gradient circle */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          transform: 'scale(1.5)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1.5); }
            50% { transform: scale(1.8); }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Your Personal{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-landing-purple to-landing-blue bg-clip-text text-transparent">AI Coach</span>
              <svg 
                className="absolute -bottom-2 left-0 w-full h-4 z-0" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                <path 
                  d="M0,10 Q25,0 50,10 T100,10"
                  stroke="url(#gradient-line)" 
                  strokeWidth="3" 
                  fill="none"
                  className="curved-underline"
                />
                <defs>
                  <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Engineered to understand your motivations and keep you accountable
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Example Display */}
          <div className="mb-12">
            <AiCoachExample activeFeature={activeFeature} features={features} />
          </div>

          {/* Feature Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-4 rounded-xl border transition-all ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r from-landing-purple/10 to-landing-blue/10 border-landing-purple/30 shadow-md'
                    : 'bg-white border-gray-100 hover:border-landing-purple/20 hover:shadow-sm'
                }`}
              >
                <feature.icon className={`w-5 h-5 mb-2 ${
                  activeFeature === feature.id 
                    ? 'text-landing-purple' 
                    : 'text-gray-400'
                }`} />
                <h3 className={`font-medium mb-1 ${
                  activeFeature === feature.id 
                    ? 'text-landing-purple' 
                    : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}