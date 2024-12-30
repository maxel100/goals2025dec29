import { supabase } from './supabase';
import { clearAuthSession } from './auth';

export async function deleteAccount() {
  try {
    // First call the delete_user_account RPC function while we still have a valid session
    const { error: deleteError } = await supabase.rpc('delete_user_account');
    
    if (deleteError) {
      console.error('Error deleting account:', deleteError);
      throw new Error('Failed to delete account: ' + deleteError.message);
    }

    // Then clear local session data
    await clearAuthSession();

    // Clear Supabase session
    await supabase.auth.signOut();

    // Force reload to clear any remaining state
    window.location.replace('/');
    
    return true;
  } catch (error) {
    console.error('Account deletion failed:', error);
    throw error;
  }
} 