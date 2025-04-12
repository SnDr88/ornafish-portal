// api/routes/me.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const sql = require('mssql');

const router = express.Router();

router.get('/common/user', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('id', sql.Int, decoded.id)
            .query('SELECT * FROM users WHERE id = @id');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('❌ Invalid token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;