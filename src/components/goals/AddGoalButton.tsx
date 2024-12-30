import React from 'react';
import { Plus } from 'lucide-react';
import { AddGoalModal } from './AddGoalModal';

interface AddGoalButtonProps {
  category: string;
}

export function AddGoalButton({ category }: AddGoalButtonProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-3 text-sm text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Goal
      </button>

      {isModalOpen && (
        <AddGoalModal
          category={category}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}