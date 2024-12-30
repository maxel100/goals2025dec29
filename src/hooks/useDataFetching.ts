import { PostgrestError } from '@supabase/supabase-js';

export function handleSingleRecordError(error: PostgrestError | null) {
  // PGRST116 means no records found - this is not a real error for our use case
  if (error?.code === 'PGRST116') {
    return null;
  }
  // For any other error, throw it so it can be handled by the caller
  if (error) {
    throw error;
  }
  return null;
}

export function handleDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}