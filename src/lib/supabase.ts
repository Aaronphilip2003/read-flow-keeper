import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
    },
})

export async function initializeSupabase() {
    try {
        // Test the connection by making a simple query
        const { data, error } = await supabase
            .from('books')
            .select('count')
            .limit(1)

        if (error) {
            throw error
        }

        console.log('✅ Successfully connected to Supabase')
        return true
    } catch (error) {
        console.error('❌ Failed to connect to Supabase:', error)
        throw error
    }
} 