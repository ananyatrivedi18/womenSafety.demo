// ===========================================================================
// routes/auth.js
// ---------------------------------------------------------------------------
// Handles everything about accounts:
//   POST /api/auth/register  -> create a new account
//   POST /api/auth/login     -> sign in and receive a JWT
//   GET  /api/auth/me        -> get the currently logged-in user's details
//
// Passwords are NEVER stored in plain text. We hash them with bcrypt, which
// turns "mypassword" into an irreversible scrambled string. At login we use
// bcrypt.compare to check a typed password against the stored hash.
// ===========================================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { store, nextId } = require('../data/store');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Small helper: build the "safe" version of a user object that we are happy
// to send to the browser. It deliberately leaves out the password hash.
function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    // Pull the fields the frontend sent in the JSON request body.
    const { name, email, phone, password, confirmPassword } = req.body;

    // --- Validation: make sure nothing important is missing. ---
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // --- Prevent duplicate accounts with the same email. ---
    const emailLower = email.toLowerCase().trim();
    const exists = store.users.find((u) => u.email === emailLower);
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // --- Hash the password. The "10" is the salt strength (cost factor). ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create and save the new user in our in-memory array. ---
    const user = {
      id: nextId(),
      name: name.trim(),
      email: emailLower,
      phone: phone.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    store.users.push(user);

    // Send back the safe user (no password). 201 = "Created".
    return res.status(201).json({
      message: 'Account created successfully.',
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Something went wrong on the server.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the user by email.
    const emailLower = email.toLowerCase().trim();
    const user = store.users.find((u) => u.email === emailLower);

    // For security we give the SAME message whether the email or the password
    // is wrong, so attackers cannot tell which emails are registered.
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the typed password against the stored bcrypt hash.
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create a signed token that proves who the user is on future requests.
    const token = jwt.sign(
      { id: user.id }, // payload — kept small, just the id
      process.env.JWT_SECRET, // secret used to sign it
      { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
    );

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong on the server.' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/auth/me  (protected — requires a valid token)
// ---------------------------------------------------------------------------
// authMiddleware runs first; if the token is valid it sets req.userId.
router.get('/me', authMiddleware, (req, res) => {
  const user = store.users.find((u) => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.json({ user: publicUser(user) });
});

module.exports = router;
