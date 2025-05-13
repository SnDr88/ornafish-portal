
// api/routes/me.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
const sql = require('mssql');

const router = express.Router();
const bcrypt = require('bcrypt');


// 🔐 Middleware om user uit token te halen
const getUserFromToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('❌ Invalid token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// ✅ GET /common/user
router.get('/common/user', getUserFromToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('id', sql.Int, req.userId)
            .query('SELECT * FROM users WHERE id = @id');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ PATCH /common/user
router.patch('/common/user', getUserFromToken, async (req, res) => {
    console.log('🟡 PATCH /common/user aangeroepen met body:', req.body);
    const { first_name, last_name, phone } = req.body.user;

    try {
        const pool = await poolPromise;
        await pool
            .request()
            .input('id', sql.Int, req.userId)
            .input('first_name', sql.NVarChar, first_name)
            .input('last_name', sql.NVarChar, last_name)
            .input('phone', sql.NVarChar, phone)
            .query(`
                UPDATE users
                SET first_name = @first_name,
                    last_name = @last_name,
                    phone = @phone
                WHERE id = @id
            `);

        // Haal de volledige user opnieuw op na de update
        const result = await pool
        .request()
        .input('id', sql.Int, req.userId)
        .query('SELECT * FROM users WHERE id = @id');

        const user = result.recordset[0];

        res.json({
        message: 'Your profile has been updated',
        user
        });
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
}
);

// ✅ PATCH /common/password
router.patch('/common/password', getUserFromToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    try {
        const pool = await poolPromise;

        // Haal huidige gebruiker op
        const result = await pool
            .request()
            .input('id', sql.Int, req.userId)
            .query('SELECT password FROM users WHERE id = @id');

        const user = result.recordset[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatches = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatches) {
            return res.status(403).json({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await pool
            .request()
            .input('id', sql.Int, req.userId)
            .input('password', sql.NVarChar, hashedNewPassword)
            .query('UPDATE users SET password = @password WHERE id = @id');

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('❌ Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;