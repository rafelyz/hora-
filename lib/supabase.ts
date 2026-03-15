import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used on the client side')
  }

  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    supabaseInstance = createClient(url, key)
  }

  return supabaseInstance
}

// Lazy export - only evaluates getSupabase() when actually used
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    return getSupabase()[prop as keyof SupabaseClient]
  }
})