
let editingId = null; // null = adding new, otherwise = id we are editing

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  //  elements we will reuse.
  const grid = document.getElementById('contactsGrid');
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactForm');
  const modalTitle = document.getElementById('modalTitle');

  // open modal
  document.getElementById('addBtn').addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Add Contact';
    form.reset();
    modal.classList.add('open');
  });

  //  Close the modal 
  document.getElementById('cancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // only when clicking the overlay itself
  });
  function closeModal() { modal.classList.remove('open'); }

  //  Save 
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: form.name.value,
      relationship: form.relationship.value,
      phone: form.phone.value,
    };

    try {
      if (editingId) {
        // PUT 
        await apiFetch(`/contacts/${editingId}`, { method: 'PUT', body });
        toast('Contact updated.');
      } else {
        // POST 
        await apiFetch('/contacts', { method: 'POST', body });
        toast('Contact added.');
      }
      closeModal();
      loadContacts(); 
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  
  async function loadContacts() {
    try {
      const data = await apiFetch('/contacts');
      const contacts = data.contacts;

      if (contacts.length === 0) {
        
        grid.innerHTML = `
          <div class="glass empty-state" style="grid-column: 1 / -1;">
            <div class="ico">👥</div>
            <h3>No emergency contacts yet</h3>
            <p>Add the people you trust most so they are one tap away.</p>
          </div>`;
        return;
      }

      
      grid.innerHTML = contacts
        .map(
          (c) => `
        <div class="glass contact-card">
          <h3>${escapeHtml(c.name)}</h3>
          <span class="rel">${escapeHtml(c.relationship)}</span>
          <p class="phone">📞 ${escapeHtml(c.phone)}</p>
          <div class="actions">
            <button class="btn ghost small" data-edit="${c.id}">Edit</button>
            <button class="btn danger small" data-delete="${c.id}">Delete</button>
          </div>
        </div>`
        )
        .join('');

      
      grid.querySelectorAll('[data-edit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const c = contacts.find((x) => x.id === btn.dataset.edit);
          editingId = c.id;
          modalTitle.textContent = 'Edit Contact';
          form.name.value = c.name;
          form.relationship.value = c.relationship;
          form.phone.value = c.phone;
          modal.classList.add('open');
        });
      });

    
      grid.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this contact?')) return;
          try {
            await apiFetch(`/contacts/${btn.dataset.delete}`, { method: 'DELETE' });
            toast('Contact deleted.');
            loadContacts();
          } catch (err) {
            toast(err.message, 'error');
          }
        });
      });
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  
  loadContacts();
});
