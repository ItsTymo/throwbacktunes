import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://njqihdhafwvjplnlmeoi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcWloZGhhZnd2anBsbmxtZW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTE3OTksImV4cCI6MjA1OTIyNzc5OX0.ha3v77oH7Zn9VC-P6gCCrXtNAsnwkmo8K9czAyOzmEU';

// Create a client with your credentials
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;