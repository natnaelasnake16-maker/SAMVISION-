import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://fntyqncgnhdfkvvlynhi.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0f6MGZWGg3G1KiDR8xxIyw_4O6cf2IT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
