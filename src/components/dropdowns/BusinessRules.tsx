import React, { useState } from 'react';
import { useRules } from '../../hooks/useRules';
import { Plus, X } from 'lucide-react';

export function BusinessRules() {
  const { rules, isLoading, error, saveRules } = useRules('business_rules');
  const [newRule, setNewRule] = useState('');

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-100 rounded" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-red-600">
        {error}
      </div>
    );
  }

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    saveRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    saveRules(updatedRules);
  };

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Add new business rule..."
          className="flex-1 p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newRule.trim()) {
              handleAddRule();
            }
          }}
        />
        <button
          onClick={handleAddRule}
          className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {rules.map((rule, index) => (
        <div
          key={index}
          className="p-2 bg-primary-50 rounded-md text-sm text-primary-800 flex justify-between items-center group"
        >
          <span>{rule}</span>
          <button
            onClick={() => handleRemoveRule(index)}
            className="opacity-0 group-hover:opacity-100 text-primary-600 hover:text-primary-700 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {rules.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          No business rules added yet
        </p>
      )}
    </div>
  );
}