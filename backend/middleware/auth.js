// ===========================================================================
// middleware/auth.js
// ---------------------------------------------------------------------------
// "Middleware" in Express is a function that runs BEFORE your route handler.
// This middleware protects private routes: it checks that the request carries
// a valid JWT (JSON Web Token). If the token is good, it attaches the user's
// id to `req.userId` and calls next() so the route can continue. If not, it
// stops the request with a 401 (Unauthorized) error.
// ===========================================================================

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // The frontend sends the token in the HTTP header:
  //   Authorization: Bearer <token>
  const authHeader = req.headers['authorization'] || '';

  // Split "Bearer <token>" into two parts and take the token part.
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7) // remove the first 7 characters: "Bearer "
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  try {
    // jwt.verify throws if the token is invalid or expired.
    // The decoded payload contains whatever we put in at login time (the id).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make the user id available to every route that runs after this.
    req.userId = decoded.id;

    // Hand control to the next middleware / route handler.
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = authMiddleware;
