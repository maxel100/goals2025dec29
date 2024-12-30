import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GoalFormProps {
  type: 'simple' | 'quantifiable' | 'monthly';
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function GoalForm({ type, onSubmit, onBack }: GoalFormProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    target: '',
    unit: '',
    trackingType: 'slider' // or 'subgoals'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      title: formData.title,
      completed: false,
      ...(type === 'quantifiable' && {
        progress: 0,
        target: parseInt(formData.target),
        unit: formData.unit,
        items: [],
        trackingType: formData.trackingType
      }),
      ...(type === 'monthly' && {
        monthlyProgress: {}
      })
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {type === 'quantifiable' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Type
              </label>
              <select
                value={formData.trackingType}
                onChange={(e) => setFormData({ ...formData, trackingType: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="slider">Slider</option>
                <option value="subgoals">Sub-goals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Number
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit (e.g., books, dollars, hours)
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create Goal
        </button>
      </div>
    </form>
  );
}