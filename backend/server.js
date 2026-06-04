
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

//  Global middleware 


app.use(cors());

// Parse incoming 
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});


app.use('/api/auth', authRoutes);


app.use('/api/contacts', authMiddleware, contactsRoutes);
app.use('/api/sos', authMiddleware, sosRoutes);


const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

//  Start the server 
app.listen(PORT, () => {
  console.log('===============================================');
  console.log(`  SheShield server running`);
  console.log(`  Open: http://localhost:${PORT}`);
  console.log('===============================================');
});
