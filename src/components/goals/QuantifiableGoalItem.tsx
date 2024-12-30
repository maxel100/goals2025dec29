import React, { useState } from 'react';
import { Goal } from '../../types/goals';
import { SubgoalTracker } from './SubgoalTracker';

interface QuantifiableGoalItemProps {
  goal: Goal;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
}

export function QuantifiableGoalItem({ goal, onUpdate }: QuantifiableGoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgress, setEditedProgress] = useState(goal.progress || 0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(goal.target || 0, Number(e.target.value));
    setEditedProgress(newValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    setIsEditing(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onUpdate(goal.id, { progress: editedProgress });
    setIsEditing(false);
  };

  if (goal.trackingType === 'subgoals') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <SubgoalTracker goal={goal} onUpdate={onUpdate} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <input
            type="range"
            min="0"
            max={goal.target || 0}
            value={isEditing ? editedProgress : (goal.progress || 0)}
            onChange={handleSliderChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute h-full bg-gradient-to-r from-landing-purple to-landing-blue rounded-full transition-all duration-200"
            style={{ width: `${isEditing ? (editedProgress / (goal.target || 1)) * 100 : ((goal.progress || 0) / (goal.target || 1)) * 100}%` }}
          />
          <div 
            className="absolute w-4 h-4 bg-white border-2 border-landing-purple rounded-full shadow-md transform -translate-y-1/2 cursor-grab active:cursor-grabbing"
            style={{ 
              left: `calc(${isEditing ? (editedProgress / (goal.target || 1)) * 100 : ((goal.progress || 0) / (goal.target || 1)) * 100}% - 0.5rem)`,
              top: '50%',
              transition: isDragging ? 'none' : 'all 0.2s ease'
            }}
          />
        </div>

        <div className="flex justify-center">
          <span className="text-sm text-gray-500">
            {isEditing ? editedProgress : (goal.progress || 0)} of {goal.target} {goal.unit}
          </span>
        </div>
      </div>
    </div>
  );
}