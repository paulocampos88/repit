import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The app works fine without Supabase configured — login, history and
// favorites simply stay hidden until VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are set (see .env.example).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[repit] Supabase não configurado — login, histórico e favoritos ficam desativados. ' +
      'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja .env.example).',
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
