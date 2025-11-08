const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /profile/:id - Xem thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(id).select('-passwordHash').lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// PUT /profile/:id - Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, currentPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

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
      
      // Check if email already exists (for other users)
      const existingUser = await User.findOne({ 
        email: emailLower, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      user.email = emailLower;
    }

    // Update password (if provided)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      // Hash and update new password
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Return user without password hash
    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
