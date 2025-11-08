const User = require('../models/User');

/**
 * Middleware giả lập xác thực user
 * Trong production thực tế, bạn nên dùng JWT token
 * Hiện tại chỉ lấy userId và role từ header để test
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Lấy userId từ header (giả lập authentication)
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required. Please provide x-user-id header' });
    }

    // Tìm user trong database
    const user = await User.findById(userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    // Gắn user vào request để các middleware/controller sau dùng
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware kiểm tra quyền Admin
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

/**
 * Middleware kiểm tra quyền: Admin hoặc chính user đó
 */
exports.requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const targetUserId = req.params.id;
  
  // Cho phép nếu là admin hoặc là chính user đó
  if (req.user.role === 'admin' || req.user._id.toString() === targetUserId) {
    return next();
  }

  res.status(403).json({ error: 'Access denied. Admin or owner access required' });
};

/**
 * Middleware tùy chọn - không bắt buộc authentication
 * Nếu có userId trong header thì load user info
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (userId) {
      const user = await User.findById(userId).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Không báo lỗi, chỉ bỏ qua
    next();
  }
};
