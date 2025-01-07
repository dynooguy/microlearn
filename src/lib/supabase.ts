import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'microlearn-auth',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});