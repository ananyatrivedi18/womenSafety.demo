// ===========================================================================
// js/common.js — shared helpers loaded by every page.
// ---------------------------------------------------------------------------
// Keeping these in one place avoids copy-pasting the same code into auth.js,
// dashboard.js, contacts.js and sos.js. It handles: talking to the API,
// storing the JWT token, showing toast messages, the logout button, the
// mobile sidebar toggle, and a "kick out if not logged in" guard.
// ===========================================================================

// Because the backend ALSO serves the frontend, API calls can be relative
// ("/api/..."). The browser sends them to the same host:port automatically.
const API_BASE = '/api';

// --- Token storage ---------------------------------------------------------
// We keep the JWT in localStorage so it survives page reloads. On every
// protected request we send it back in the Authorization header.
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

// --- One helper for every API call -----------------------------------------
// Usage: const data = await apiFetch('/contacts', { method: 'POST', body: {...} });
// It automatically: adds JSON headers, attaches the token, parses the JSON
// response, and throws an Error (with the server message) on failure.
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

  // Try to read JSON even on errors so we can show the server's message.
  let data = {};
  try { data = await res.json(); } catch (_) { /* no JSON body */ }

  if (!res.ok) {
    // If the token expired, send the user back to login.
    if (res.status === 401 && Auth.isLoggedIn()) {
      Auth.clear();
      window.location.href = 'login.html';
    }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// --- Toast notifications ---------------------------------------------------
// Pops a small message in the top-right corner that fades away.
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

// --- Security helper: escape user text before putting it in HTML -----------
// This prevents a contact named "<script>..." from running as code (XSS).
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Route guard for protected pages ---------------------------------------
// Call this at the top of dashboard/contacts/sos/tips scripts. If there is no
// token, the user is redirected to the login page.
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// --- Wire up shared UI bits when the page loads ----------------------------
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
