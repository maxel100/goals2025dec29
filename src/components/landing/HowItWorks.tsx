import React, { useState } from 'react';
import { Target, Users, Info, ArrowRight } from 'lucide-react';
import { FeatureDemo } from './FeatureDemo';

interface Study {
  title: string;
  authors: string;
  url: string;
  summary: string;
}

export function HowItWorks() {
  const [showStudies, setShowStudies] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'breakdown',
      icon: Target,
      title: 'Goal Breakdown System',
      description: 'Reverse engineers your yearly goals into actionable monthly, weekly, and daily tasks',
      studies: [
        {
          title: 'Implementation Intentions: Strong Effects of Simple Plans',
          authors: 'Gollwitzer, P. M. (1999)',
          url: 'https://www.researchgate.net/publication/12863356_Implementation_Intentions_Strong_Effects_of_Simple_Plans',
          summary: 'Breaking down goals into specific implementation plans increases achievement by 2-3x'
        },
        {
          title: 'Does monitoring goal progress promote goal attainment?',
          authors: 'Harkin, B., Webb, T. L., et al. (2016)',
          url: 'https://psycnet.apa.org/record/2016-05549-001',
          summary: 'Regular progress monitoring significantly increases goal success rates'
        }
      ]
    },
    {
      id: 'social',
      icon: Users,
      title: 'Social Accountability',
      description: 'Share goals with friends and leverage social support for motivation',
      studies: [
        {
          title: 'Accounting for the effects of accountability',
          authors: 'Lerner, J. S., & Tetlock, P. E. (1999)',
          url: 'https://psycnet.apa.org/record/1999-01015-007',
          summary: 'Social accountability improves follow-through by up to 65%'
        },
        {
          title: 'Social Support & Accountability in Goal Pursuit',
          authors: 'Prestwich, A., et al. (2003)',
          url: 'https://www.tandfonline.com/doi/abs/10.1080/08870440310001594493',
          summary: 'Social support increases goal achievement rates by 78%'
        }
      ]
    }
  ];

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#3b82f6_0%,_transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-landing-blue text-sm font-medium mb-4">
            <Info className="w-4 h-4" />
            Backed by Scientific Research
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Scientifically Engineered for Success
          </h2>
          <p className="text-xl text-gray-600">
            Two key features proven to increase goal achievement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Feature Header */}
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>

              {/* Feature Demo */}
              <div className="p-6 bg-gray-50">
                <FeatureDemo featureId={feature.id} />
              </div>

              {/* Research Link */}
              <div className="p-4 bg-white border-t border-primary-100">
                <button
                  onClick={() => {
                    setShowStudies(true);
                    setActiveFeature(feature.id);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    View Research Studies
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Studies Modal */}
      {showStudies && activeFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Research Studies
                </h3>
                <button
                  onClick={() => setShowStudies(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {features
                .find(f => f.id === activeFeature)
                ?.studies.map((study, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-gray-900">{study.title}</h4>
                    <p className="text-sm text-gray-500">{study.authors}</p>
                    <p className="text-gray-600">{study.summary}</p>
                    <a 
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      Read Study
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}