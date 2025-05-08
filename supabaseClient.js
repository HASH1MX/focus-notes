
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hmrakiparrhbjhlwskme.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcmFraXBhcnJoYmpobHdza21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjAyMzIsImV4cCI6MjA2MjI5NjIzMn0.7TS66Cq6DNU8zP58TPlUrVp5SLh6Dy_AV37YjlY2MWE";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
