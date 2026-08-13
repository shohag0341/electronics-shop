// Supabase Client Configuration
// আপনার Supabase Project URL এবং anon key এখানে বসান

const SUPABASE_URL = 'https://llwveqlnppdcfvhihagx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WWXRZgRaCjjweR-GJ8hbmA_Zfj2WqXo';

// Check if Supabase is loaded
if (typeof supabase === 'undefined') {
  console.error('Supabase JS library not loaded. Please check the CDN script.');
}

export const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

