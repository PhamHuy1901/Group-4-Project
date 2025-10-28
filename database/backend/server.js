const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000/' }));
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('Mongo connect error:', err.message); process.exit(1); });

app.use((req,res,next)=>{ console.log(req.method, req.url); next(); });

app.use('/users', require('./routes/user'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on', PORT));