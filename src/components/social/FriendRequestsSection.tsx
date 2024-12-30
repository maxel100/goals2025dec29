import React, { useState } from 'react';
import { GoalSharingRequest } from './GoalSharingRequest';
import { FriendRequestsList } from './FriendRequestsList';
import { Inbox, Send } from 'lucide-react';

export function FriendRequestsSection() {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');

  return (
    <div className="space-y-6">
      {/* Request Goal Access Form */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Request Goal Access</h3>
        <GoalSharingRequest />
      </div>

      {/* Friend Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Friend Requests</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'received'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Received
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === 'sent'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send className="w-4 h-4" />
              Sent
            </button>
          </div>
        </div>
        <FriendRequestsList type={activeTab} />
      </div>
    </div>
  );
}