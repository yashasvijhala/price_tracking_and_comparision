import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpmashrepkfstgbvpnno.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwbWFzaHJlcGtmc3RnYnZwbm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1NDY5MjQsImV4cCI6MjAxMDEyMjkyNH0.NASVuFyxLUSve6Th2V6gCpV35Ct1lXswAmwiSZ4424o'
export const supabase = createClient(supabaseUrl, supabaseKey)
