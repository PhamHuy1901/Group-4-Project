const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../config/email');

// POST /forgot-password - Gửi email với token reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      // Không tiết lộ email có tồn tại hay không (security best practice)
      return res.json({ 
        message: 'If the email exists, a reset link has been sent' 
      });
    }

    // Tạo reset token (random 32 bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token trước khi lưu vào database (security best practice)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Lưu token và thời gian hết hạn (1 giờ)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Gửi email với token gốc (chưa hash)
    try {
      await sendResetPasswordEmail(user.email, resetToken, user.name);
      
      res.json({ 
        message: 'Password reset email sent successfully',
        // Chỉ để debug, production nên bỏ:
        ...(process.env.NODE_ENV === 'development' && { 
          debug: { token: resetToken } 
        })
      });
    } catch (emailError) {
      // Xóa token nếu gửi email thất bại
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      console.error('Email sending failed:', emailError);
      return res.status(500).json({ 
        error: 'Failed to send reset email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// POST /reset-password - Reset password với token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Hash token để so sánh với database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Tìm user với token và kiểm tra thời gian hết hạn
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // Token chưa hết hạn
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash password mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật password và xóa token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      message: 'Password reset successfully. You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// GET /verify-reset-token - Kiểm tra token có hợp lệ không (optional)
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid or expired token' 
      });
    }

    res.json({ 
      valid: true, 
      message: 'Token is valid',
      email: user.email 
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
};
