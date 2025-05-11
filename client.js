// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Authentication Handlers
async function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        alert('Sign up successful! Please check your email for verification.');
        showPage('login-page');
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        showPage('dashboard');
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

// Note Management Functions
async function loadNotes() {
    const response = await fetch('/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <h3>
                <i class="fas fa-sticky-note"></i>
                ${note.title}
            </h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button onclick="editNote(${note.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button onclick="deleteNote(${note.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function showAddNoteForm() {
    document.getElementById('note-form').classList.remove('hidden');
    document.getElementById('note-form-title').textContent = 'Add Note';
    document.getElementById('note-id').value = '';
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

function hideNoteForm() {
    document.getElementById('note-form').classList.add('hidden');
}

async function handleSaveNote(event) {
    event.preventDefault();
    const id = document.getElementById('note-id').value;
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    if (!title.trim() || !content.trim()) {
        alert('Please fill in both title and content');
        return;
    }

    const url = id ? `/notes/${id}` : '/notes';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save note');
        }
        
        await loadNotes();
        hideNoteForm();
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note: ' + error.message);
    }
}

async function editNote(id) {
    const response = await fetch(`/notes/${id}`);
    const note = await response.json();
    
    document.getElementById('note-form').classList.remove('hidden');
    document.getElementById('note-form-title').textContent = 'Edit Note';
    document.getElementById('note-id').value = id;
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        const response = await fetch(`/notes/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete note');
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

async function handleLogout() {
    try {
        await fetch('/auth/logout', { method: 'POST' });
        showPage('landing-page');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Load notes when dashboard is shown
document.getElementById('dashboard').addEventListener('show', loadNotes);

// Make functions globally available
window.showPage = showPage;
window.handleSignUp = handleSignUp;
window.handleLogin = handleLogin;
window.showAddNoteForm = showAddNoteForm;
window.hideNoteForm = hideNoteForm;
window.handleSaveNote = handleSaveNote;
window.editNote = editNote;
window.deleteNote = deleteNote;
window.handleLogout = handleLogout;

// THEME TOGGLE LOGIC
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const toggleSlider = themeToggle.querySelector('.toggle-slider');

function setTheme(dark) {
    if (dark) {
        body.classList.add('dark');
        themeToggle.classList.add('dark');
        toggleSlider.innerHTML = '<i class="fas fa-sun"></i>';
        toggleSlider.querySelector('i').style.color = '#fff';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        themeToggle.classList.remove('dark');
        toggleSlider.innerHTML = '<i class="fas fa-moon"></i>';
        toggleSlider.querySelector('i').style.color = '';
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark'));
});

// On load, set theme from localStorage
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setTheme(true);
    else setTheme(false);
})();
