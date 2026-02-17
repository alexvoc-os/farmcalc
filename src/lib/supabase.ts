import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Verifică toate variantele posibile de nume pentru variabile
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY;

// Safe initialization - nu crashează la build dacă lipsesc variabilele
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
