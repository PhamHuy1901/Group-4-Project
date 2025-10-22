// server.js
const express = require('express');
const app = express();

app.use(express.json());

// (tuỳ chọn) healthcheck để test nhanh:
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
