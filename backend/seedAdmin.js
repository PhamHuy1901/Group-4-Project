const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('ID:', existingAdmin._id);
      process.exit(0);
    }

    // Tạo admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('ID:', admin._id);
    console.log('\nĐể test API, dùng header: x-user-id =', admin._id);

    // Tạo thêm 1 user thường để test
    const passwordHash2 = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash: passwordHash2,
      role: 'user'
    });

    console.log('\n✅ Regular user created successfully!');
    console.log('Email:', regularUser.email);
    console.log('Password: user123');
    console.log('Role:', regularUser.role);
    console.log('ID:', regularUser._id);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
