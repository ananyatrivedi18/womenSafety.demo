

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAuth()) return; 

  try {
    
    const [meData, contactsData, sosData] = await Promise.all([
      apiFetch('/auth/me'),
      apiFetch('/contacts'),
      apiFetch('/sos'),
    ]);

    const user = meData.user;
    Auth.setUser(user); 

    
    document.getElementById('avatar').textContent =
      (user.name || '?').charAt(0).toUpperCase();
    document.getElementById('welcomeName').textContent = user.name;
    document.getElementById('welcomeSub').textContent =
      'Stay safe. Your protection circle is ready when you need it.';

    // Stat cards
    document.getElementById('contactCount').textContent = contactsData.contacts.length;
    document.getElementById('sosCount').textContent = sosData.alerts.length;

    // Days old acc
    const created = new Date(user.createdAt);
    const days = Math.max(0, Math.floor((Date.now() - created) / 86400000));
    document.getElementById('memberDays').textContent = days;

    //  Account details list
    document.getElementById('detailName').textContent = user.name;
    document.getElementById('detailEmail').textContent = user.email;
    document.getElementById('detailPhone').textContent = user.phone;
    document.getElementById('detailJoined').textContent = created.toLocaleDateString();
  } catch (err) {
    toast(err.message, 'error');
  }
});
