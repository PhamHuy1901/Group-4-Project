const User = require('../models/User');

// GET all
exports.getUsers = async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

// POST create
exports.createUser = async (req, res) => {
  const { name, email } = req.body || {};
  if (!name?.trim() || !email?.trim())
    return res.status(400).json({ error: 'name & email required' });
  const u = await User.create({ name: name.trim(), email: email.trim() });
  res.status(201).json(u);
};

// PUT update
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
};

// DELETE remove
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};