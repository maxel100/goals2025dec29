import React, { useState, useEffect } from 'react';
import { Check, X, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface Notification {
  id: string;
  from_user_id: string;
  from_email: string;
  created_at: string;
}

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('sharing_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sharing_requests',
      }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('sharing_requests')
        .select(`
          id,
          from_user_id,
          created_at,
          from_profile:user_profiles!sharing_requests_from_user_id_fkey(email)
        `)
        .eq('to_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mark notifications as read
      if (data.length > 0) {
        await supabase
          .from('sharing_requests')
          .update({ read: true })
          .eq('to_user_id', user.id)
          .eq('status', 'pending');
      }

      setNotifications(data.map(n => ({
        id: n.id,
        from_user_id: n.from_user_id,
        from_email: n.from_profile.email,
        created_at: n.created_at
      })));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('sharing_requests')
        .update({
          status: accept ? 'accepted' : 'rejected',
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Remove from list
      setNotifications(prev => prev.filter(n => n.id !== id));

      // If no more notifications, close dropdown
      if (notifications.length === 1) {
        setTimeout(() => onClose(), 300);
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div 
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-4 border-b">
        <h3 className="font-medium">Goal Sharing Requests</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No pending requests</div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-full">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-900">{notification.from_email}</p>
                  <p className="text-xs text-gray-500">wants to view your goals</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAction(notification.id, true)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(notification.id, false)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Decline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}