const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on', PORT));