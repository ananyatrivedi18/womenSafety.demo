// ===========================================================================
// js/dashboard.js — fills the dashboard with the user's info and counts.
// ---------------------------------------------------------------------------
// Steps:
//   1. Make sure the user is logged in (requireAuth from common.js).
//   2. Fetch fresh user details, contacts, and SOS history from the API.
//   3. Put the numbers into the page.
// ===========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return; // redirects to login if no token

  try {
    // Run all three requests at once for speed using Promise.all.
    const [meData, contactsData, sosData] = await Promise.all([
      apiFetch('/auth/me'),
      apiFetch('/contacts'),
      apiFetch('/sos'),
    ]);

    const user = meData.user;
    Auth.setUser(user); // refresh the cached copy

    // --- Welcome card ---
    // First letter of the name becomes the avatar initial.
    document.getElementById('avatar').textContent =
      (user.name || '?').charAt(0).toUpperCase();
    document.getElementById('welcomeName').textContent = user.name;
    document.getElementById('welcomeSub').textContent =
      'Stay safe. Your protection circle is ready when you need it.';

    // --- Stat cards ---
    document.getElementById('contactCount').textContent = contactsData.contacts.length;
    document.getElementById('sosCount').textContent = sosData.alerts.length;

    // Days since the account was created (a friendly extra stat).
    const created = new Date(user.createdAt);
    const days = Math.max(0, Math.floor((Date.now() - created) / 86400000));
    document.getElementById('memberDays').textContent = days;

    // --- Account details list ---
    document.getElementById('detailName').textContent = user.name;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.phone;
    document.getElementById('detailJoined').textContent = created.toLocaleDateString();
  } catch (err) {
    toast(err.message, 'error');
  }
});
