import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minRows?: number;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  minRows = 3
}: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={minRows}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-landing-green focus:border-landing-green resize-none"
      />
    </div>
  );
}