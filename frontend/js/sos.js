

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const sosBtn = document.getElementById('sosBtn');
  const modal = document.getElementById('sosModal');
  const confirmBtn = document.getElementById('confirmSos');
  const cancelBtn = document.getElementById('cancelSos');
  const historyEl = document.getElementById('sosHistory');

  
  sosBtn.addEventListener('click', () => modal.classList.add('open'));

  cancelBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  
  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Sending…';

    
    const location = await getLocation();

    try {
      const data = await apiFetch('/sos', {
        method: 'POST',
        body: { message: 'Emergency! I need help.', location },
      });
      modal.classList.remove('open');
      toast(`SOS sent! ${data.contactsNotified} contact(s) would be alerted.`);
      loadHistory();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Yes, Send SOS';
    }
  });

  
  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve('Location not supported');
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`),
        () => resolve('Location permission denied'),
        { timeout: 5000 }
      );
    });
  }

  // Fetch and draw the alert history (newest first — the server already sorts).
  async function loadHistory() {
    try {
      const data = await apiFetch('/sos');
      const alerts = data.alerts;

      if (alerts.length === 0) {
        historyEl.innerHTML = `<p class="muted">No alerts yet. Stay safe.</p>`;
        return;
      }

      historyEl.innerHTML = alerts
        .map(
          (a) => `
        <div class="glass alert-row">
          <div class="dot"></div>
          <div>
            <div>${escapeHtml(a.message)}</div>
            <div class="meta">📍 ${escapeHtml(a.location)} • ${new Date(a.createdAt).toLocaleString()}</div>
          </div>
        </div>`
        )
        .join('');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  loadHistory();
});
