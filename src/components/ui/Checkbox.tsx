import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export function Checkbox({ checked, onChange, className = '' }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${
        checked
          ? 'bg-gradient-to-r from-purple-500 to-blue-500 border-transparent'
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      role="checkbox"
      aria-checked={checked}
    >
      {checked && <Check className="w-3.5 h-3.5 text-white" />}
    </button>
  );
}