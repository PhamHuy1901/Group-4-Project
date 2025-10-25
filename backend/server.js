const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' })); // Cho phép React truy cập
app.use(express.json());

const userRoutes = require('./routes/user');
app.use('/users', userRoutes); // mount đúng đường dẫn

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));