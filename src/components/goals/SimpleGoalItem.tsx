import React, { useState, useEffect, useRef } from 'react';
import { SimpleGoal } from '../../types';
import { Checkbox } from '../ui/Checkbox';
import { CelebrationAnimation } from '../ui/CelebrationAnimation';

interface Props {
  goal: SimpleGoal;
  onUpdate: (goalId: string, updates: Partial<SimpleGoal>) => void;
}

export function SimpleGoalItem({ goal, onUpdate }: Props) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>();
  const checkboxRef = useRef<HTMLDivElement>(null);

  const handleChange = () => {
    if (!goal.completed && checkboxRef.current) {
      const rect = checkboxRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setPosition(undefined);
      }, 1500);
    }
    onUpdate(goal.id, { completed: !goal.completed });
  };

  return (
    <div className="flex items-start gap-3 group relative">
      <div ref={checkboxRef}>
        <Checkbox
          checked={goal.completed}
          onChange={handleChange}
        />
      </div>
      <span 
        className={`text-sm transition-colors duration-200
          ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}
          group-hover:text-primary-700`}
      >
        {goal.title}
      </span>
      <CelebrationAnimation isVisible={showCelebration} position={position} />
    </div>
  );
}