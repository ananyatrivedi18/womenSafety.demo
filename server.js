// ===========================================================================
// data/store.js
// ---------------------------------------------------------------------------
// This is our "database" — except it lives entirely in memory (plain JS
// arrays/objects). That keeps the project simple: there is nothing to install
// or configure. The trade-off is that ALL data is lost whenever the server
// restarts. That is fine for learning.
//
// We export a single shared object. Because Node caches modules, every file
// that does `require('./data/store')` receives the SAME object, so all routes
// read and write the same data.
// ===========================================================================

const store = {
  // Each user looks like:
  // { id, name, email, phone, password (bcrypt hash), createdAt }
  users: [],

  // Each contact looks like:
  // { id, userId, name, relationship, phone }
  contacts: [],

  // Each SOS alert looks like:
  // { id, userId, message, location, createdAt }
  sosAlerts: [],

  // Simple counter so every new record gets a unique, increasing id.
  _lastId: 0,
};

// Helper that returns the next unique id as a string.
// We keep it here so id generation logic lives in one place.
function nextId() {
  store._lastId += 1;
  return String(store._lastId);
}

module.exports = { store, nextId };
const authRoutes = require('./auth');
const contactsRoutes = require('./contacts');
const sosRoutes = require('./sos');
const authMiddleware = require('./middleware/auth');
