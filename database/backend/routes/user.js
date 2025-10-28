const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (_req,res) => {
  const users = await User.find().lean();
  res.json(users);
});

router.post('/', async (req,res) => {
  try {
    const { name, email } = req.body || {};
    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ error: 'name & email required' });

    const u = await User.create({ name: name.trim(), email: email.trim() });
    return res.status(201).json(u);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'email exists' });
    console.error('POST /users error:', err);           // log stack
    return res.status(500).json({ error: err.message }); // trả thông điệp thật
  }
});

module.exports = router;