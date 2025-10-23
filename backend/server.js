require('dotenv').config();
// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// (tuỳ chọn) healthcheck để test nhanh:
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// mount user routes
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

