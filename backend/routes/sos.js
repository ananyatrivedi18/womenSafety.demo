// ===========================================================================
// routes/sos.js
// ---------------------------------------------------------------------------
// The SOS (emergency alert) system.
//   POST /api/sos -> create a new SOS alert
//   GET  /api/sos -> list this user's past alerts (newest first)
//
// In a real product, creating an alert would also text/email the user's
// emergency contacts and share GPS location. Here we just record it in memory
// so beginners can see the full flow without external services.
// ===========================================================================

const express = require('express');
const { store, nextId } = require('../data/store');

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/sos  -> record a new emergency alert.
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  // message and location are optional; we fall back to sensible defaults.
  const { message, location } = req.body;

  const alert = {
    id: nextId(),
    userId: req.userId,
    message: (message && message.trim()) || 'Emergency! I need help.',
    location: (location && location.trim()) || 'Location not provided',
    createdAt: new Date().toISOString(),
  };
  store.sosAlerts.push(alert);

  // We can also tell the frontend how many contacts would be notified.
  const contactCount = store.contacts.filter((c) => c.userId === req.userId).length;

  return res.status(201).json({
    message: 'SOS alert sent.',
    alert,
    contactsNotified: contactCount,
  });
});

// ---------------------------------------------------------------------------
// GET /api/sos  -> return this user's alert history, newest first.
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const myAlerts = store.sosAlerts
    .filter((a) => a.userId === req.userId)
    // sort by date descending (newest at the top)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json({ alerts: myAlerts });
});

module.exports = router;
