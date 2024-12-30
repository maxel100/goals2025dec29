import React, { useState, useEffect } from 'react';
import { Users, Send, Inbox, X, UserX, Loader2, AlertTriangle } from 'lucide-react';
import { GoalSharingRequest } from './GoalSharingRequest';
import { FriendRequestsList } from './FriendRequestsList';
import { SharedGoalsView } from './SharedGoalsView';
import { useSharedUsers } from '../../hooks/useSharedUsers';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface FriendsGoalsSectionProps {
  onClose: () => void;
}

interface Friend {
  id: string;
  email: string;
  relationshipId: string;
}

interface UserProfile {
  id: string;
  email: string;
}

interface SharingRelationship {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  from_profile: {
    id: string;
    email: string;
  };
  to_profile: {
    id: string;
    email: string;
  };
}

export function FriendsGoalsSection({ onClose }: FriendsGoalsSectionProps) {
  const [activeTab, setActiveTab] = useState<'connections' | 'sent' | 'received'>('connections');
  const [selectedUser, setSelectedUser] = useState<{id: string; email: string} | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Subscribe to sharing_requests changes
  useEffect(() => {
    const channel = supabase
      .channel('sharing_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sharing_requests'
        },
        () => {
          loadFriends();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Initial load and tab change reload
  useEffect(() => {
    loadFriends();
  }, [activeTab]);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();

      // Get all accepted sharing relationships
      const { data: relationships, error: relationshipsError } = await supabase
        .from('sharing_requests')
        .select(`
          id,
          from_user_id,
          to_user_id,
          status,
          from_profile:user_profiles!sharing_requests_from_user_id_fkey(id, email),
          to_profile:user_profiles!sharing_requests_to_user_id_fkey(id, email)
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (relationshipsError) throw relationshipsError;

      // Format friends list
      const friendsList = (relationships as unknown as SharingRelationship[]).map(rel => {
        const isSender = rel.from_user_id === user.id;
        return {
          id: isSender ? rel.to_profile.id : rel.from_profile.id,
          email: isSender ? rel.to_profile.email : rel.from_profile.email,
          relationshipId: rel.id
        };
      });

      setFriends(friendsList);
      setError(null);
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Failed to load friends list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      setDeletingId(friendId);
      const user = await getCurrentUser();

      // Find the relationship ID first
      const { data: relationship, error: findError } = await supabase
        .from('sharing_requests')
        .select('id')
        .eq('status', 'accepted')
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${friendId}),and(from_user_id.eq.${friendId},to_user_id.eq.${user.id})`)
        .single();

      if (findError) {
        console.error('Find error:', findError);
        throw findError;
      }

      if (!relationship) {
        throw new Error('Relationship not found');
      }

      // Delete the specific relationship by ID
      const { error: deleteError } = await supabase
        .from('sharing_requests')
        .delete()
        .eq('id', relationship.id);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Update local state
      setFriends(prev => prev.filter(f => f.id !== friendId));
      setError(null);
    } catch (err) {
      console.error('Error removing friend:', err);
      setError('Failed to remove friend');
    } finally {
      setDeletingId(null);
    }
  };

  if (selectedUser) {
    return (
      <SharedGoalsView 
        userId={selectedUser.id} 
        userEmail={selectedUser.email} 
        onClose={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Friends Goals</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Send Request Form */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Request Goal Access</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your goals with friends and see their progress! Enter your friend's email below to send them a request.
          Once they accept, you'll be able to view each other's goals and track progress together.
        </p>
        <GoalSharingRequest onSuccess={loadFriends} />
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'connections'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Connections ({friends.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Received
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sent'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Sent
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-100 p-4">
        {activeTab === 'connections' ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Connected Users</h3>
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Loading connections...</div>
            ) : error ? (
              <div className="flex items-center justify-center gap-2 text-red-600 py-4">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p>No connected users yet</p>
                <p className="text-sm mt-2">Send a request to start sharing goals with friends!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map(friend => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{friend.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(friend)}
                        className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        View Goals
                      </button>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        disabled={deletingId === friend.id}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove connection"
                      >
                        {deletingId === friend.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <FriendRequestsList type={activeTab} onRequestHandled={loadFriends} />
        )}
      </div>
    </div>
  );
}