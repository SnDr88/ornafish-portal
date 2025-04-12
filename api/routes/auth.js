// api/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const sql = require('mssql');

// ✅ Token validatie en vernieuwen + volledige user info
router.post('/auth/sign-in-with-token', async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const pool = await poolPromise;

        // 🧠 Haal volledige user info uit database
        const result = await pool
            .request()
            .input('id', sql.Int, decoded.id)
            .query('SELECT * FROM users WHERE id = @id');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 🔄 Genereer eventueel een nieuwe token
        const newToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
            message: 'Token valid',
            accessToken: newToken,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role_id: user.role_id,
                company_id: user.company_id,
                breeder_id: user.breeder_id
            },
        });
    } catch (err) {
        console.error('❌ Invalid token:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});
module.exports = router;