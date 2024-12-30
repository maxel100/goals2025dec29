import { supabase } from './supabase';

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error('Failed to get current user: ' + error.message);
  if (!session) throw new Error('No authenticated user found');
  return session.user;
}

export async function signOut() {
  try {
    // First clear any stored session data
    localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_URL + '-auth-token');
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Force reload the page to clear any cached state
    window.location.replace('/');
  } catch (error) {
    console.error('Failed to sign out:', error);
    // Force reload even if there's an error
    window.location.replace('/');
  }
}

// Handle OAuth callback
export async function handleAuthCallback() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth callback error:', error);
    return false;
  }

  if (session) {
    // Initialize user records after successful auth
    try {
      await supabase.rpc('ensure_user_records');
    } catch (err) {
      console.error('Error ensuring user records:', err);
    }
    return true;
  }

  return false;
}

export async function clearAuthSession() {
  try {
    // Clear any local storage items
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('currentUser');
    
    // Clear any other auth-related items you might have
    sessionStorage.clear();
    
    return true;
  } catch (error) {
    console.error('Error clearing auth session:', error);
    throw error;
  }
}