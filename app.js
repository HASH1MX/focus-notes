
import supabase from './supabaseClient.js';

// Page Navigation
window.showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
};

// Authentication Handlers
window.handleSignUp = async (event) => {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Sign up successful! Please check your email for verification.');
        showPage('login-page');
    } catch (error) {
        errorElement.textContent = error.message;
    }
};

window.handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await loadNotes();
        showPage('dashboard');
    } catch (error) {
        errorElement.textContent = error.message;
    }
};

window.handleLogout = async () => {
    await supabase.auth.signOut();
    showPage('landing-page');
};

// Notes Management
let currentNotes = [];

async function loadNotes() {
    const { data: notes, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading notes:', error);
        return;
    }

    currentNotes = notes;
    displayNotes();
}

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = currentNotes.map(note => `
        <div class="note-card">
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="editNote('${note.id}')">Edit</button>
                <button onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

window.showAddNoteForm = () => {
    document.getElementById('note-form-title').textContent = 'Add Note';
    document.getElementById('note-id').value = '';
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-form').classList.remove('hidden');
};

window.hideNoteForm = () => {
    document.getElementById('note-form').classList.add('hidden');
};

window.handleSaveNote = async (event) => {
    event.preventDefault();
    const noteId = document.getElementById('note-id').value;
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    try {
        if (noteId) {
            await supabase
                .from('notes')
                .update({ title, content })
                .eq('id', noteId);
        } else {
            await supabase
                .from('notes')
                .insert([{ title, content }]);
        }
        await loadNotes();
        hideNoteForm();
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note');
    }
};

window.editNote = (noteId) => {
    const note = currentNotes.find(n => n.id === noteId);
    if (!note) return;

    document.getElementById('note-form-title').textContent = 'Edit Note';
    document.getElementById('note-id').value = note.id;
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    document.getElementById('note-form').classList.remove('hidden');
};

window.deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);
        await loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note');
    }
};

// Check initial auth state
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        loadNotes();
        showPage('dashboard');
    } else {
        showPage('landing-page');
    }
});
