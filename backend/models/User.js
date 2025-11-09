const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true }, // lưu hash, không lưu plain text
  role: { type: String, enum: ['user','admin'], default: 'user' }, // để sau dùng RBAC
  avatar: { type: String }, // URL của avatar (Cloudinary)
  resetPasswordToken: { type: String }, // Token để reset password
  resetPasswordExpires: { type: Date }, // Thời gian hết hạn của token
  refreshTokens: [{ // Lưu danh sách Refresh Tokens (support multiple devices)
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  }]
}, { timestamps: true });

// Tạo index unique cho email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
