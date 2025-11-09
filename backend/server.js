const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS configuration - Allow all origins for now
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('Mongo connect error:', err.message); process.exit(1); });

app.use((req,res,next)=>{ console.log(req.method, req.url); next(); });

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));
app.use('/profile', require('./routes/profile'));
app.use('/password', require('./routes/password'));
app.use('/upload', require('./routes/upload'));

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});