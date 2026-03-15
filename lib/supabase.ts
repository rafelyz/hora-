import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// If either is missing, this will show a clear error in your browser console
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing! Check your Vercel/Netlify settings.")
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)