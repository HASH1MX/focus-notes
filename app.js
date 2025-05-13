import express from 'express';
import supabase from './supabaseClient.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Middleware to get user from Supabase token
async function getUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No authorization header' });
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = data.user;
  next();
}

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Auth endpoints
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Notes endpoints
app.get('/notes', getUser, async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase.from('note').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/notes', getUser, async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from('note')
    .insert([{ 
      title, 
      content,
      user_id: userId,
      created_at: new Date().toISOString()
    }])
    .select();
  if (error) {
    console.error('Supabase insert error:', error, 'data:', data);
    return res.status(400).json({ error: error.message || 'Unknown error' });
  }
  res.json(data[0]);
});

app.put('/notes/:id', getUser, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from('note')
    .update({ 
      title, 
      content,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

app.delete('/notes/:id', getUser, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { error } = await supabase.from('note').delete().eq('id', id).eq('user_id', userId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

app.post('/auth/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});