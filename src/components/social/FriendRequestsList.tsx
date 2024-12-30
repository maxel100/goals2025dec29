import React, { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface FriendRequestsListProps {
  type: 'sent' | 'received';
  onRequestHandled?: () => void;
}

interface UserProfile {
  id: string;
  email: string;
}

interface SharingRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_profile: UserProfile;
  to_profile: UserProfile;
}

export function FriendRequestsList({ type, onRequestHandled }: FriendRequestsListProps) {
  const [requests, setRequests] = useState<SharingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
    subscribeToRequests();
  }, [type]);

  const subscribeToRequests = () => {
    const subscription = supabase
      .channel('sharing_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sharing_requests'
        },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const loadRequests = async () => {
    try {
      const user = await getCurrentUser();
      const query = supabase
        .from('sharing_requests')
        .select(`
          id,
          from_user_id,
          to_user_id,
          status,
          created_at,
          from_profile:user_profiles!sharing_requests_from_user_id_fkey(id, email),
          to_profile:user_profiles!sharing_requests_to_user_id_fkey(id, email)
        `)
        .eq('status', 'pending');

      if (type === 'sent') {
        query.eq('from_user_id', user.id);
      } else {
        query.eq('to_user_id', user.id);
      }

      const { data: requests, error: requestsError } = await query;

      if (requestsError) throw requestsError;

      setRequests(requests as SharingRequest[]);
      setError(null);
    } catch (err) {
      console.error('Error loading requests:', err);
      setError('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingId(requestId);
      const { error: updateError } = await supabase
        .from('sharing_requests')
        .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      await loadRequests();
      onRequestHandled?.();
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No {type} requests
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map(request => (
        <div
          key={request.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <span className="text-sm text-gray-900">
            {type === 'sent' ? request.to_profile.email : request.from_profile.email}
          </span>
          
          {type === 'received' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRequest(request.id, 'accept')}
                disabled={processingId === request.id}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Accept request"
              >
                {processingId === request.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleRequest(request.id, 'reject')}
                disabled={processingId === request.id}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Reject request"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}