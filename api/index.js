const express = require('express');
const cors = require('cors');
const app = express();
const usersRoutes = require('./routes/users');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});