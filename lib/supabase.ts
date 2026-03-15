import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_DATABASE_URL, and NEXT_PUBLIC_SUPABASE_ANON_KEY)')
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabase()
    const value = Reflect.get(client, prop, receiver)
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
