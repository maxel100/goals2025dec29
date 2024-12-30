import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('sharing_requests')
        .select('id')
        .eq('to_user_id', user.id)
        .eq('status', 'pending')
        .eq('read', false);

      if (!error && data) {
        setHasUnread(data.length > 0);
        setCount(data.length);
      }
    };

    loadNotifications();

    // Subscribe to new requests
    const channel = supabase
      .channel('sharing_requests')
      .on('postgres_changes', {
        event: 'INSERT',
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}