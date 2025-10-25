// server.js
const express = require('express');
const app = express();

app.use(express.json());

// (tuỳ chọn) healthcheck để test nhanh:
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// mount user routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));