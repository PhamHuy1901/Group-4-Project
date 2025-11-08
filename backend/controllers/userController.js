const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all - Chỉ Admin mới thấy tất cả users
exports.getUsers = async (req, res) => {
  try {
    // Không trả về passwordHash
    const users = await User.find().select('-passwordHash').lean();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// POST create
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'name & email required' });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Chỉ admin mới có thể set role, user thường mặc định là 'user'
    let userRole = 'user';
    if (role && req.user && req.user.role === 'admin') {
      userRole = role;
    }
    
    const u = await User.create({ 
      name: name.trim(), 
      email: email.trim().toLowerCase(),
      passwordHash,
      role: userRole
    });
    
    // Không trả về passwordHash
    const userResponse = u.toObject();
    delete userResponse.passwordHash;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    
    // Xử lý lỗi duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// PUT update
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }
    
    // Update email
    if (email && email.trim()) {
      const emailLower = email.trim().toLowerCase();
      
      // Check duplicate email
      const existingUser = await User.findOne({ 
        email: emailLower, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      user.email = emailLower;
    }
    
    // Chỉ admin mới được thay đổi role
    if (role && req.user && req.user.role === 'admin') {
      user.role = role;
    }
    
    await user.save();
    
    // Không trả về passwordHash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// DELETE remove - Admin hoặc chính user đó mới xóa được
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await User.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: deleted._id,
        name: deleted.name,
        email: deleted.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};