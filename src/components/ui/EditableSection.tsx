import React, { useState } from 'react';
import { Pencil, Save, X, Plus } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  fields: {
    label: string;
    value: string;
    name: string;
  }[];
  onSave: (data: Record<string, string>) => Promise<void>;
}

export function EditableSection({ title, fields, onSave }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );

  const hasContent = fields.some(field => field.value.trim());

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  // Compact view for empty sections
  if (!hasContent && !isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group"
      >
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
        <span className="text-gray-600 group-hover:text-primary-700">Add {title}</span>
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-primary-50"
          >
            <Pencil className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSubmit}
              className="p-2 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{field.label}</h4>
            {isEditing ? (
              <textarea
                value={formData[field.name]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {field.value || 'Not set yet'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}