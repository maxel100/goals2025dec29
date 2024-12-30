import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SharedGoalsList } from './SharedGoalsList';
import { useSharedGoals } from '../../hooks/useSharedGoals';

interface SharedGoalsModalProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

export function SharedGoalsModal({ userId, userEmail, onClose }: SharedGoalsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { goals, isLoading, error } = useSharedGoals(userId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50 overflow-y-auto">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 mb-16"
      >
        {/* Header with sticky close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{userEmail}'s Goals</h2>
            <p className="text-sm text-gray-500">{goals.length} goals total</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Loading goals...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <SharedGoalsList goals={goals} />
          )}
        </div>
      </div>
    </div>
  );
}