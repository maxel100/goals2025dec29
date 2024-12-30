import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Goal } from '../../types/goals';

interface SubgoalTrackerProps {
  goal: Goal;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
}

export function SubgoalTracker({ goal, onUpdate }: SubgoalTrackerProps) {
  const [newItem, setNewItem] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const updatedItems = [
      ...(goal.items || []),
      {
        id: crypto.randomUUID(),
        title: newItem.trim(),
        completed: false
      }
    ];

    onUpdate(goal.id, {
      items: updatedItems,
      progress: updatedItems.filter(item => item.completed).length
    });
    setNewItem('');
  };

  const toggleItem = (itemId: string) => {
    const updatedItems = goal.items?.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ) || [];

    onUpdate(goal.id, {
      items: updatedItems,
      progress: updatedItems.filter(item => item.completed).length
    });
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = goal.items?.filter(item => item.id !== itemId) || [];
    
    onUpdate(goal.id, {
      items: updatedItems,
      progress: updatedItems.filter(item => item.completed).length
    });
  };

  return (
    <div className="space-y-4">
      {/* Progress summary with dropdown toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <span>{goal.progress || 0} of {goal.target || 0} {goal.unit}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="space-y-4 pt-2">
          {/* Items list */}
          <div className="space-y-2">
            {goal.items?.map(item => (
              <div 
                key={item.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className={`flex-grow text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {item.title}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new item form */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add ${goal.unit?.slice(0, -1) || 'item'}...`}
              className="flex-grow p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={!newItem.trim()}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 