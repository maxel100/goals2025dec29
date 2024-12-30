import React from 'react';
import { SimpleGoal } from '../../types';

interface Props {
  goal: SimpleGoal;
}

export function EnergyIntentionItem({ goal }: Props) {
  return (
    <div className="transform transition-all duration-200 hover:scale-102 hover:-rotate-1">
      <div className="bg-primary-50 p-4 rounded-lg shadow-sm border-b-4 border-primary-200 rotate-1">
        <p className="text-sm font-medium text-primary-800 leading-relaxed">
          {goal.title}
        </p>
      </div>
    </div>
  );
}