import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface GoalSharingRequestProps {
  onSuccess?: () => void;
}

export function GoalSharingRequest({ onSuccess }: GoalSharingRequestProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = await getCurrentUser();

      // Check if user is trying to send request to themselves
      if (user.email === email) {
        throw new Error('You cannot send a request to yourself');
      }

      // Check if the target user exists
      const { data: targetUser, error: userError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', email)
        .single();

      if (userError || !targetUser) {
        throw new Error('User not found');
      }

      // Check if a request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('sharing_requests')
        .select('id, status')
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${targetUser.id}),and(from_user_id.eq.${targetUser.id},to_user_id.eq.${user.id})`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          throw new Error('A request is already pending with this user');
        } else if (existingRequest.status === 'accepted') {
          throw new Error('You are already connected with this user. Please check your Connections tab.');
        } else if (existingRequest.status === 'rejected') {
          // If the request was previously rejected, allow sending a new request
          const { error: deleteError } = await supabase
            .from('sharing_requests')
            .delete()
            .eq('id', existingRequest.id);

          if (deleteError) throw deleteError;
        }
      }

      // Create the request
      const { error: createError } = await supabase
        .from('sharing_requests')
        .insert({
          from_user_id: user.id,
          to_user_id: targetUser.id,
          status: 'pending'
        });

      if (createError) throw createError;

      setSuccess(true);
      setEmail('');
      onSuccess?.();
    } catch (err) {
      console.error('Error sending request:', err);
      setError(err instanceof Error ? err.message : 'Failed to send request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter friend's email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-2 text-sm text-green-600">Request sent successfully!</p>
        )}
      </div>
    </form>
  );
}