


const API_BASE = '/api';

// --- Token storage

const Auth = {
  getToken() { return localStorage.getItem('sheshield_token'); },
  setToken(t) { localStorage.setItem('sheshield_token', t); },
  clear() {
    localStorage.removeItem('sheshield_token');
    localStorage.removeItem('sheshield_user');
  },
  getUser() {
    const raw = localStorage.getItem('sheshield_user');
    return raw ? JSON.parse(raw) : null;
  },
  setUser(u) { localStorage.setItem('sheshield_user', JSON.stringify(u)); },
  isLoggedIn() { return !!this.getToken(); },
};


async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, {
    method: options.method || 'GET',
    headers,
    // Only attach a body for methods that have one.
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  
  let data = {};
  try { data = await res.json(); } catch (_) { /* no JSON body */ }

  if (!res.ok) {
    
    if (res.status === 401 && Auth.isLoggedIn()) {
      Auth.clear();
      window.location.href = 'login.html';
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// --- Toast notifications --
function toast(message, type = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  // Remove after 3.2 seconds.
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// --- Security helper

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Route guard for protected pages 

function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

//  Wire up shared UI bits when the page loads 
document.addEventListener('DOMContentLoaded', () => {
  // Logout buttons (any element with id="logoutBtn").
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.clear();
      window.location.href = 'login.html';
    });
  }

  // Mobile sidebar open/close.
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Close the sidebar when a link inside it is tapped (nicer on phones).
    sidebar.querySelectorAll('.side-link').forEach((link) =>
      link.addEventListener('click', () => sidebar.classList.remove('open'))
    );
  }
});
