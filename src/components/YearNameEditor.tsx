import React, { useState, useEffect } from 'react';
import { useYearName } from '../hooks/useYearName';

export function YearNameEditor() {
  const { yearName, updateYearName } = useYearName();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(yearName);

  useEffect(() => {
    setName(yearName);
  }, [yearName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateYearName(name);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating year name:', error);
    }
  };

  const handleBlur = async () => {
    try {
      await updateYearName(name);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating year name:', error);
      // Revert to previous name on error
      setName(yearName);
    }
  };

  const RocketSymbol = () => (
    <div className="p-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
      <svg 
        viewBox="0 0 24 24" 
        className="w-5 h-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
          </linearGradient>
        </defs>
        {/* Rocket body */}
        <path
          d="M12 2C9 7 9 12 9 17L15 17C15 12 15 7 12 2Z"
          fill="url(#rocketGradient)"
        />
        {/* Left fin */}
        <path
          d="M9 13L6 16L9 17"
          fill="url(#rocketGradient)"
        />
        {/* Right fin */}
        <path
          d="M15 13L18 16L15 17"
          fill="url(#rocketGradient)"
        />
        {/* Bottom flames */}
        <path
          d="M10 17L8 21M12 17L12 22M14 17L16 21"
          stroke="url(#rocketGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Window */}
        <circle
          cx="12"
          cy="10"
          r="1.5"
          fill="white"
        />
      </svg>
    </div>
  );

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <RocketSymbol />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b border-primary-500 bg-transparent focus:outline-none px-1 text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent italic"
          autoFocus
          onBlur={handleBlur}
        />
      </form>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <RocketSymbol />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent italic">
        {name}
      </h1>
    </div>
  );
}