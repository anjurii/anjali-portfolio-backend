const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Make sure filename case matches

// =======================
// PUBLIC ROUTE - Save Message
// =======================
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    res.status(200).json({ message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// =======================
// ADMIN LOGIN
// =======================
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  if (username === 'anjali' && password === 'admin123') {

    const token = jwt.sign(
      { role: 'admin' },
      'secretKey',
      { expiresIn: '1h' }
    );

    res.json({ token });

  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
// =======================
// PROTECTED ROUTE - Get Messages
// =======================
router.get('/contacts', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secretKey');

    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json(contacts);

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
