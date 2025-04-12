const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./db');

const userRoutes = require('./routes/users'); // ✅ voeg deze toe
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes); // ✅ koppel je routes hier
app.use('/api', authRoutes);
app.use('/api', require('./routes/me'));

app.get('/api/test', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT GETDATE() AS now');
        res.json({ success: true, time: result.recordset[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 API is running on http://localhost:${port}`);
});