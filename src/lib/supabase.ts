import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ejwjrsgkxxrwlyfohdat.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2pyc2dreHhyd2x5Zm9oZGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDQ4NTcsImV4cCI6MjA2OTEyMDg1N30.ayt6cFCW0m9uXbYV73yb-TusfcQehWzMQpP8t3eXqdg'

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

