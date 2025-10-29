const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true }, // lưu hash, không lưu plain text
  role: { type: String, enum: ['user','admin'], default: 'user' } // để sau dùng RBAC
}, { timestamps: true });

// Tạo index unique cho email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
