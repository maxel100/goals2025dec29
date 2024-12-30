import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useSharedUsers } from '../../hooks/useSharedUsers';
import { SharedGoalsView } from './SharedGoalsView';

export function SharedUsersDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
  const { users, isLoading } = useSharedUsers();

  if (users.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Users className="w-5 h-5" />
        <span className="hidden sm:inline">Shared Goals</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : users.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No shared goals yet</div>
            ) : (
              users.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-lg"
                >
                  {user.email}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-sm text-gray-600 hover:text-gray-800 mb-6"
              >
                ← Back to my goals
              </button>
              <SharedGoalsView
                userId={selectedUser.id}
                userEmail={selectedUser.email}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}