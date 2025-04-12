const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

// POST /api/users → nieuwe gebruiker aanmaken
router.post('/', async (req, res) => {
    const { email, password, first_name, last_name, role_id, company_id, breeder_id } = req.body;

    if (!email || !password || !first_name || !last_name || !role_id) {
        return res.status(400).json({ message: 'Email, password, first name, last name en role_id zijn verplicht.' });
    }

    try {
        const pool = await poolPromise;

        // Check of gebruiker al bestaat
        const check = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id FROM users WHERE email = @email');

        if (check.recordset.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Gebruiker aanmaken
        await pool
            .request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('first_name', sql.NVarChar, first_name)
            .input('last_name', sql.NVarChar, last_name)
            .input('role_id', sql.Int, role_id)
            .input('company_id', sql.Int, company_id ?? null)
            .input('breeder_id', sql.Int, breeder_id ?? null)
            .query(`
                INSERT INTO users (email, password, first_name, last_name, role_id, company_id, breeder_id)
                VALUES (@email, @password, @first_name, @last_name, @role_id, @company_id, @breeder_id)
            `);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('❌ Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/users/login → login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
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
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;