const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const pickUser = (u) => ({ 
  _id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt 
});

/**
 * Tạo Access Token (thời gian sống ngắn, 15 phút)
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { sub: userId.toString(), role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

/**
 * Tạo Refresh Token (thời gian sống dài, 7 ngày)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { sub: userId.toString(), type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};

/**
 * Lưu Refresh Token vào database
 */
const saveRefreshToken = async (user, refreshToken) => {
  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);
  
  // Thêm refresh token vào danh sách
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt
  });
  
  // Giới hạn số lượng refresh tokens (max 5 devices)
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }
  
  // Xóa các token đã hết hạn
  user.refreshTokens = user.refreshTokens.filter(rt => rt.expiresAt > new Date());
  
  await user.save();
};

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

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    
    // Lưu Refresh Token vào database
    await saveRefreshToken(user, refreshToken);

    return res.json({ 
      message: 'Login success', 
      accessToken,
      refreshToken,
      user: pickUser(user) 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Theo yêu cầu buổi 5, Logout là xóa token phía client.
// Optionally có thể làm blacklist server-side, nhưng không bắt buộc cho hoạt động 1.
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.json({ message: 'Logout success (client should delete tokens)' });
    }

    // Decode để lấy userId
    const decoded = jwt.decode(refreshToken);
    
    if (decoded?.sub) {
      // Xóa refresh token khỏi database
      await User.findByIdAndUpdate(decoded.sub, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }

    return res.json({ message: 'Logout success, refresh token revoked' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.json({ message: 'Logout success (client should delete tokens)' });
  }
};

/**
 * POST /auth/refresh - Làm mới Access Token bằng Refresh Token
 */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify Refresh Token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Tìm user và kiểm tra refresh token có tồn tại trong database
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Kiểm tra refresh token có trong danh sách của user
    const tokenExists = user.refreshTokens.some(
      rt => rt.token === refreshToken && rt.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Tạo Access Token mới
    const newAccessToken = generateAccessToken(user._id, user.role);

    // Tùy chọn: Rotate refresh token (tạo refresh token mới)
    let newRefreshToken = refreshToken;
    if (process.env.ROTATE_REFRESH_TOKEN === 'true') {
      newRefreshToken = generateRefreshToken(user._id);
      
      // Xóa refresh token cũ và thêm token mới
      await User.findByIdAndUpdate(user._id, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
      
      await saveRefreshToken(user, newRefreshToken);
    }

    return res.json({ 
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired', code: 'REFRESH_TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    console.error('Refresh token error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
