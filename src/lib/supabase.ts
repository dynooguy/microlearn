import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctjewyhxpttdzymirbjk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please click "Connect to Supabase" to set up your connection.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'microlearn-auth',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'microlearn-web'
    }
  }
});