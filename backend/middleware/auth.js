

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  
  const authHeader = req.headers['authorization'] || '';

  
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7) 
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.userId = decoded.id;

    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

module.exports = authMiddleware;
