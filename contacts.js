{
  "name": "sheshield-backend",
  "version": "1.0.0",
  "description": "Backend API for SheShield - Women's Safety Portal (in-memory storage, JWT auth)",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "keywords": ["safety", "express", "jwt", "bcrypt"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2"
  }
}
