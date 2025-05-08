import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and anon key
const supabaseUrl = "https://hmrakiparrhbjhlwskme.supabase.co"; // Get this from your Supabase dashboard
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcmFraXBhcnJoYmpobHdza21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjAyMzIsImV4cCI6MjA2MjI5NjIzMn0.7TS66Cq6DNU8zP58TPlUrVp5SLh6Dy_AV37YjlY2MWE"; // Get this from your Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
