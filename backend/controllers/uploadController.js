const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

// POST /upload-avatar - Upload avatar lên Cloudinary
exports.uploadAvatar = async (req, res) => {
  try {
    // Kiểm tra xem có file không
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Kiểm tra user đã đăng nhập chưa
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Upload lên Cloudinary từ buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'user-avatars', // Tạo folder riêng cho avatars
          public_id: `user_${req.user._id}_${Date.now()}`, // Tên file unique
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Crop vuông, focus vào mặt
            { quality: 'auto' }, // Tự động tối ưu chất lượng
            { fetch_format: 'auto' } // Tự động chọn format tốt nhất
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Pipe buffer vào upload stream
      uploadStream.end(req.file.buffer);
    });

    // Xóa avatar cũ trên Cloudinary (nếu có)
    if (req.user.avatar) {
      try {
        // Extract public_id from URL
        const urlParts = req.user.avatar.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `user-avatars/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error('Error deleting old avatar:', deleteError);
        // Không throw error, vẫn tiếp tục update avatar mới
      }
    }

    // Cập nhật avatar URL vào database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-passwordHash');

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: uploadResult.secure_url,
      user: user
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      error: 'Failed to upload avatar',
      details: error.message 
    });
  }
};

// DELETE /delete-avatar - Xóa avatar
exports.deleteAvatar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.avatar) {
      return res.status(400).json({ error: 'No avatar to delete' });
    }

    // Xóa trên Cloudinary
    try {
      const urlParts = req.user.avatar.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `user-avatars/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (deleteError) {
      console.error('Error deleting avatar from Cloudinary:', deleteError);
    }

    // Xóa URL khỏi database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: null },
      { new: true }
    ).select('-passwordHash');

    res.json({
      message: 'Avatar deleted successfully',
      user: user
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
};
