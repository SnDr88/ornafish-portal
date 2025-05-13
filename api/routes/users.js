const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');
const bcrypt = require('bcrypt');
const sql = require('mssql');
const jwt = require('jsonwebtoken');

// POST /api/users → nieuwe gebruiker aanmaken
router.post('/', async (req, res) => {
    const { email, password, first_name, last_name, phone, role_id, company_id, breeder_id } = req.body;

    if (!email || !password || !first_name || !last_name) {
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
            .input('phone', sql.NVarChar, phone)
            .input('company_id', sql.UniqueIdentifier, company_id ?? null)
            .input('breeder_id', sql.UniqueIdentifier, breeder_id ?? null)
            .query(`
                INSERT INTO users (email, password, first_name, last_name, phone, company_id, breeder_id)
                VALUES (@email, @password, @first_name, @last_name, @phone, @company_id, @breeder_id)
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
                phone: user.phone,
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

// GET /api/users/company/:companyId → haal alle users van een specifiek bedrijf op
router.get('/company/:companyId', async (req, res) => {
    const { companyId } = req.params;

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('companyId', sql.UniqueIdentifier, companyId) // Gebruik UniqueIdentifier als company_id een GUID is
            .query('SELECT id, email, first_name, last_name, phone FROM users WHERE company_id = @companyId');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Error fetching users by company:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;

        // Verwijder gebruiker op basis van id
        await pool
            .request()
            .input('id', sql.UniqueIdentifier, id)
            .query('DELETE FROM users WHERE id = @id');

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// In je backend - users.js
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    try {

        const pool = await poolPromise;

        // Zorg ervoor dat je het juiste datatype gebruikt voor UUID's
        const result = await pool.request()
            .input('id', sql.UniqueIdentifier, userId)  // Gebruik UniqueIdentifier voor de UUID
            .input('firstName', sql.NVarChar, userData.first_name)
            .input('lastName', sql.NVarChar, userData.last_name)
            .input('email', sql.NVarChar, userData.email)
            .query(`
                UPDATE users 
                SET first_name = @firstName, last_name = @lastName, email = @email
                WHERE id = @id
            `);
        
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;