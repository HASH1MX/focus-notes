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
app.get('/notes', async (req, res) => {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase.from('notes').insert([{ title, content }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { data, error } = await supabase.from('notes').update({ title, content }).eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});