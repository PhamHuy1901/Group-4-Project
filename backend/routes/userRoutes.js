const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Lấy tất cả users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Tạo mới user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  await newUser.save();
  res.json({ message: "User created successfully!" });
});

module.exports = router;
