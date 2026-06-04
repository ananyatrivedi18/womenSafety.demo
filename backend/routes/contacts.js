// ===========================================================================
// routes/contacts.js
// ---------------------------------------------------------------------------
// Emergency contacts CRUD (Create, Read, Update, Delete).
//   GET    /api/contacts      -> list the logged-in user's contacts
//   POST   /api/contacts      -> add a contact
//   PUT    /api/contacts/:id  -> edit a contact
//   DELETE /api/contacts/:id  -> remove a contact
//
// EVERY route here is protected by authMiddleware (see server.js where we
// mount it). Each user only ever sees their own contacts because we filter by
// req.userId, which the middleware put on the request from the token.
// ===========================================================================

const express = require('express');
const { store, nextId } = require('../data/store');

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /api/contacts  -> return all contacts that belong to this user.
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const myContacts = store.contacts.filter((c) => c.userId === req.userId);
  return res.json({ contacts: myContacts });
});

// ---------------------------------------------------------------------------
// POST /api/contacts  -> create a new contact for this user.
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  const { name, relationship, phone } = req.body;

  if (!name || !relationship || !phone) {
    return res.status(400).json({ message: 'Name, relationship and phone are required.' });
  }

  const contact = {
    id: nextId(),
    userId: req.userId, // tie the contact to whoever is logged in
    name: name.trim(),
    relationship: relationship.trim(),
    phone: phone.trim(),
  };
  store.contacts.push(contact);

  return res.status(201).json({ message: 'Contact added.', contact });
});

// ---------------------------------------------------------------------------
// PUT /api/contacts/:id  -> update an existing contact.
// ---------------------------------------------------------------------------
router.put('/:id', (req, res) => {
  const { id } = req.params; // the :id part of the URL
  const { name, relationship, phone } = req.body;

  // Find the contact AND make sure it belongs to the current user.
  const contact = store.contacts.find(
    (c) => c.id === id && c.userId === req.userId
  );
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found.' });
  }

  // Update only the fields that were actually provided.
  if (name !== undefined) contact.name = name.trim();
  if (relationship !== undefined) contact.relationship = relationship.trim();
  if (phone !== undefined) contact.phone = phone.trim();

  return res.json({ message: 'Contact updated.', contact });
});

// ---------------------------------------------------------------------------
// DELETE /api/contacts/:id  -> remove a contact.
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = store.contacts.findIndex(
    (c) => c.id === id && c.userId === req.userId
  );
  if (index === -1) {
    return res.status(404).json({ message: 'Contact not found.' });
  }

  // splice removes 1 item at the found position.
  store.contacts.splice(index, 1);

  return res.json({ message: 'Contact deleted.' });
});

module.exports = router;
