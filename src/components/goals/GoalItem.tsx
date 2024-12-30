import React, { useState } from 'react';
import { Goal } from '../types';
import { SimpleGoalItem } from './SimpleGoalItem';
import { QuantifiableGoalItem } from './QuantifiableGoalItem';
import { MonthlyGoalItem } from './MonthlyGoalItem';
import { EnergyIntentionItem } from './EnergyIntentionItem';
import { useGoalStore } from '../../store/goalStore';
import { Trash2, EyeOff, Eye } from 'lucide-react';

interface GoalItemProps {
  goal: Goal;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
}

export function GoalItem({ goal, onUpdate }: GoalItemProps) {
  const deleteGoal = useGoalStore(state => state.deleteGoal);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteGoal(goal.id);
  };

  const toggleVisibility = () => {
    onUpdate(goal.id, { hidden: !goal.hidden });
  };

  // Special handling for energy category
  if (goal.category === 'energy' && goal.type === 'simple') {
    return <EnergyIntentionItem goal={goal} />;
  }

  const GoalComponent = {
    simple: SimpleGoalItem,
    quantifiable: QuantifiableGoalItem,
    monthly: MonthlyGoalItem,
  }[goal.type];

  return (
    <div className="group relative">
      <GoalComponent goal={goal} onUpdate={onUpdate} />
      
      <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={toggleVisibility}
          className="p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
          title={goal.hidden ? "Show in social sharing" : "Hide from social sharing"}
        >
          {goal.hidden ? (
            <Eye className="w-3 h-3 text-gray-500" />
          ) : (
            <EyeOff className="w-3 h-3 text-gray-500" />
          )}
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-red-50"
            aria-label="Delete goal"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        ) : (
          <div className="absolute right-0 top-0 flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
            <span className="text-sm text-gray-600">Delete?</span>
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}