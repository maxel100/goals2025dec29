import React from 'react';
import { UserX, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface Friend {
  id: string;
  email: string;
}

export function FriendManagement() {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const user = await getCurrentUser();

      // Get all accepted sharing relationships
      const { data: relationships, error: relationshipsError } = await supabase
        .from('sharing_requests')
        .select(`
          id,
          from_user_id,
          to_user_id,
          from_profile:user_profiles!sharing_requests_from_user_id_fkey(id, email),
          to_profile:user_profiles!sharing_requests_to_user_id_fkey(id, email)
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (relationshipsError) throw relationshipsError;

      // Format friends list
      const friendsList = relationships.map(rel => {
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

      // Delete sharing relationship in both directions
      const { error: deleteError } = await supabase
        .from('sharing_requests')
        .delete()
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${friendId}),and(from_user_id.eq.${friendId},to_user_id.eq.${user.id})`);

      if (deleteError) throw deleteError;

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

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-600">
        <AlertTriangle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No connected friends yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900 mb-4">Connected Friends</h3>
      {friends.map(friend => (
        <div
          key={friend.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
        >
          <span className="text-sm text-gray-900">{friend.email}</span>
          <button
            onClick={() => handleRemoveFriend(friend.id)}
            disabled={deletingId === friend.id}
            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Remove friend"
          >
            {deletingId === friend.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserX className="w-4 h-4" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}