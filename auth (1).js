// ===========================================================================
// server.js  — the entry point of the backend.
// ---------------------------------------------------------------------------
// Responsibilities:
//   1. Load environment variables from .env
//   2. Create the Express app and add global middleware (JSON parsing, CORS)
//   3. Mount the API routes (auth / contacts / sos)
//   4. Serve the static frontend files (HTML/CSS/JS)
//   5. Start listening on the configured port
// ===========================================================================

// Load variables from the .env file into process.env. Must run early.
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
const sosRoutes = require('./routes/sos');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global middleware -----------------------------------------------------

// CORS lets the browser call this API even if the frontend is served from a
// different origin (handy if you open the HTML files directly during dev).
app.use(cors());

// Parse incoming JSON request bodies into req.body.
app.use(express.json());

// A tiny logger so you can SEE every request in your terminal while learning.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// --- API routes ------------------------------------------------------------

// Auth routes are public (register/login). The /me route inside protects
// itself with authMiddleware.
app.use('/api/auth', authRoutes);

// Contacts and SOS routes must ALL be protected, so we apply authMiddleware
// here once, before the router. Every request to these paths now needs a
// valid token, and req.userId will be available inside the route handlers.
app.use('/api/contacts', authMiddleware, contactsRoutes);
app.use('/api/sos', authMiddleware, sosRoutes);

// --- Serve the frontend ----------------------------------------------------

// This serves everything inside the ../frontend folder as static files, so
// visiting http://localhost:5000/ shows index.html, /login.html works, etc.
// This means the frontend and backend run from the SAME server — no CORS
// headaches and one command to start everything.
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// A simple health-check endpoint, useful for testing the server is alive.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- Start the server ------------------------------------------------------
app.listen(PORT, () => {
  console.log('===============================================');
  console.log(`  SheShield server running`);
  console.log(`  Open: http://localhost:${PORT}`);
  console.log('===============================================');
});
