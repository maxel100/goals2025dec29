import { PostgrestError } from '@supabase/supabase-js';

export function handleSingleRecordError(error: PostgrestError | null) {
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
} 