import React from 'react';
import { Calendar, Users, ArrowDown, BookOpen, Clock, GraduationCap } from 'lucide-react';

interface FeatureDemoProps {
  featureId: string;
}

export function FeatureDemo({ featureId }: FeatureDemoProps) {
  if (featureId === 'breakdown') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-primary-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900">Yearly Goal</span>
          </div>
          <span className="text-primary-600">Learn Spanish</span>
        </div>
        <ArrowDown className="w-4 h-4 text-primary-500 mx-auto" />
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 bg-white rounded-lg border border-primary-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-900">Monthly</span>
            </div>
            <div className="pl-2 space-y-1">
              <span className="text-sm text-primary-600 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Complete 10 hours of training
              </span>
              <span className="text-sm text-primary-600 flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                Pass one proficiency test
              </span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-primary-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-900">Weekly</span>
            </div>
            <div className="pl-2 space-y-1">
              <span className="text-sm text-primary-600 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                2.5 hours of practice sessions
              </span>
              <span className="text-sm text-primary-600 flex items-center gap-2">
                <Users className="w-3 h-3" />
                One session with language tutor
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (featureId === 'social') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-primary-100">
          <div className="p-2 bg-primary-100 rounded-full">
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-grow">
            <div className="text-sm font-medium text-gray-900">Sarah completed her goal!</div>
            <div className="text-sm text-gray-500">Monthly Spanish practice: 12 hours 🎉</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-primary-100">
          <div className="p-2 bg-primary-100 rounded-full">
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-grow">
            <div className="text-sm font-medium text-gray-900">Michael passed A1 level</div>
            <div className="text-sm text-gray-500">Spanish proficiency test completed 📚</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}