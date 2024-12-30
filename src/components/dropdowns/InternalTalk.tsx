import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRules } from '../../hooks/useRules';

export function InternalTalk() {
  const { rules, isLoading, saveRules } = useRules('internal_talk');
  const [newRule, setNewRule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.trim()) {
      saveRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedRules = rules.filter((_, index) => index !== indexToDelete);
    saveRules(updatedRules);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {(!rules || rules.length === 0) ? (
        <div className="text-center py-6 px-4">
          <p className="text-gray-600 mb-4">
            Here you should place the internal talk you want to reinforce this year. For example:
            <br />
            <span className="italic text-gray-500">"I am grateful"</span>
            <br />
            <span className="italic text-gray-500">"I am perseverant"</span>
          </p>
          <button
            onClick={() => document.getElementById('talkInput')?.focus()}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add your first affirmation</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {rules.map((rule, index) => (
            <div key={index} className="group flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-300">
              <p className="flex-grow text-gray-700">{rule}</p>
              <button
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                title="Delete affirmation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            id="talkInput"
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Add a new affirmation..."
            className="flex-grow p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newRule.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}