const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const pickUser = (u) => ({ 
  _id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt 
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash
    });

    return res.status(201).json({ message: 'Signup success', user: pickUser(user) });
  } catch (err) {
    // Lỗi trùng unique index
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'email & password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    return res.json({ message: 'Login success', token, user: pickUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Theo yêu cầu buổi 5, Logout là xóa token phía client.
// Optionally có thể làm blacklist server-side, nhưng không bắt buộc cho hoạt động 1.
exports.logout = async (_req, res) => {
  return res.json({ message: 'Logout success (client should delete token)' });
};
