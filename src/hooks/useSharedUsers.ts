import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { Goal } from '../types';

interface SharedUser {
  id: string;
  email: string;
  goals?: Goal[];
}

export function useSharedUsers() {
  const [users, setUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSharedUsers();

    // Subscribe to changes
    const channel = supabase
      .channel('sharing_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sharing_requests',
      }, () => {
        loadSharedUsers();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadSharedUsers = async () => {
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
        .eq('status', 'accepted')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

      if (relationshipsError) throw relationshipsError;

      if (!relationships?.length) {
        setUsers([]);
        return;
      }

      // Format users list, handling both directions of sharing
      const connectedUsers = relationships.map(rel => {
        const isFromUser = rel.from_user_id === user.id;
        return {
          id: isFromUser ? rel.to_profile.id : rel.from_profile.id,
          email: isFromUser ? rel.to_profile.email : rel.from_profile.email
        };
      });

      // Load goals for each user
      const usersWithGoals = await Promise.all(
        connectedUsers.map(async (connectedUser) => {
          const { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', connectedUser.id);

          if (goalsError) throw goalsError;

          return {
            ...connectedUser,
            goals: goals || []
          };
        })
      );

      setUsers(usersWithGoals);
      setError(null);
    } catch (err) {
      console.error('Error loading shared users:', err);
      setError('Failed to load shared users');
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, error, refresh: loadSharedUsers };
}