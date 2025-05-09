const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users – Register a new user
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// GET /users/:id – Fetch user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

module.exports = router;
