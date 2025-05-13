const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, '../../uploads/avatars');
// ✅ Zorg dat deze map bestaat
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${req.params.id}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

// PATCH /api/contacts/:id - update of insert (upsert) contact
router.patch('/:id', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'contact', maxCount: 1 }
]), async (req, res) => {
    console.log('📦 req.body:', req.body);
    console.log('📎 req.files:', req.files);
    const id = req.params.id;
    const contact = JSON.parse(req.body.contact);

    const avatarFile = req.files?.avatar?.[0];
if (avatarFile) {
    // Voeg avatar-pad toe aan je contact object:
    contact.avatar = `/uploads/avatars/${avatarFile.filename}`;
}

    try {
        const pool = await poolPromise;

        // Check if contact exists
        const check = await pool
            .request()
            .input('id', sql.UniqueIdentifier, id)
            .query('SELECT id FROM contacts WHERE id = @id');

        const exists = check.recordset.length > 0;

        if (!exists) {
            // INSERT
            const insertResult = await pool
                .request()
                .input('id', sql.UniqueIdentifier, id)
                .input('avatar', sql.NVarChar, contact.avatar ?? null)
                .input('company', sql.NVarChar, contact.company)
                .input('type', sql.NVarChar, contact.type)
                .input('agent_id', sql.UniqueIdentifier, contact.agentId ?? null)
                .input('business_reg_nr', sql.NVarChar, contact.businessRegNr)
                .input('customer_nr', sql.NVarChar, contact.customerNr)
                .input('website', sql.NVarChar, contact.website)
                .input('default_airport', sql.NVarChar, contact.defaultAirport)
                .input('currency', sql.NVarChar, contact.currency)
                .input('discount', sql.Int, contact.discount)
                .input('commission', sql.Int, contact.commission)
                .input('default_commission', sql.Int, contact.defaultCommission)
                .input('notes', sql.NVarChar, contact.notes)
                .input('legal_representative', sql.NVarChar, contact.legal_representative ?? null)
                .query(`
                    INSERT INTO contacts (id, avatar, company, type, agent_id, business_reg_nr, customer_nr, website, default_airport, currency, discount, commission, default_commission, notes, legal_representative)
                    VALUES (@id, @avatar, @company, @type, @agent_id, @business_reg_nr, @customer_nr, @website, @default_airport, @currency, @discount, @commission, @default_commission, @notes, @legal_representative)
                `);

                // INSERT adresgegevens
                if (Array.isArray(contact.addresses)) {
                    for (const addr of contact.addresses) {
                        await pool.request()
                            .input('contact_id', sql.UniqueIdentifier, id)
                            .input('label', sql.NVarChar, addr.label)
                            .input('address', sql.NVarChar, addr.address)
                            .input('zip', sql.NVarChar, addr.zip)
                            .input('city', sql.NVarChar, addr.city)
                            .input('country', sql.NVarChar, addr.country)
                            .input('longitude', sql.Float, addr.longitude ?? null)  // Voeg longitude toe
                            .input('latitude', sql.Float, addr.latitude ?? null)    // Voeg latitude toe
                            .input('show_on_locator_map', sql.Bit, addr.show_on_locator_map ?? false)
                            .query(`
                                INSERT INTO contact_addresses (contact_id, label, address, zip, city, country, longitude, latitud, show_on_locator_map)
                                VALUES (@contact_id, @label, @address, @zip, @city, @country, @longitude, @latitude, @show_on_locator_map)
                            `);
                    }
                }

                // INSERT telefoonnummers
                if (Array.isArray(contact.phoneNumbers)) {
                    for (const phone of contact.phoneNumbers) {
                        await pool.request()
                            .input('contact_id', sql.UniqueIdentifier, id)
                            .input('country', sql.NVarChar, phone.country)
                            .input('phoneNumber', sql.NVarChar, phone.phoneNumber)
                            .input('label', sql.NVarChar, phone.label)
                            .query(`
                                INSERT INTO contact_phone_numbers (contact_id, country, phone_number, label)
                                VALUES (@contact_id, @country, @phoneNumber, @label)
                            `);
                    }
                }

                // INSERT e-mailadressen
                if (Array.isArray(contact.emails)) {
                    for (const email of contact.emails) {
                        await pool.request()
                            .input('contact_id', sql.UniqueIdentifier, id)
                            .input('email', sql.NVarChar, email.email)
                            .input('label', sql.NVarChar, email.label ?? null)
                            .query(`
                                INSERT INTO contact_emails (contact_id, email, label)
                                VALUES (@contact_id, @email, @label)
                            `);
                    }
                }

            return res.status(201).json({ id, message: 'Contact inserted via PATCH' });
        }

        // UPDATE
        await pool
        .request()
        .input('id', sql.UniqueIdentifier, id)
        .input('avatar', sql.NVarChar, contact.avatar ?? null)
        .input('company', sql.NVarChar, contact.company)
        .input('type', sql.NVarChar, contact.type)
        .input('agent_id', sql.UniqueIdentifier, contact.agentId ?? null)
        .input('business_reg_nr', sql.NVarChar, contact.businessRegNr)
        .input('customer_nr', sql.NVarChar, contact.customerNr)
        .input('website', sql.NVarChar, contact.website)
        .input('default_airport', sql.NVarChar, contact.defaultAirport)
        .input('currency', sql.NVarChar, contact.currency)
        .input('discount', sql.Int, contact.discount)
        .input('commission', sql.Int, contact.commission)
        .input('default_commission', sql.Int, contact.defaultCommission ?? null)
        .input('notes', sql.NVarChar, contact.notes)
        .input('longitude', sql.Float, contact.longitude)
        .input('latitude', sql.Float, contact.latitude)
        .input('legal_representative', sql.NVarChar, contact.legal_representative ?? null)
        .query(`
            UPDATE contacts
            SET avatar = @avatar,
                company = @company,
                type = @type,
                agent_id = @agent_id,
                business_reg_nr = @business_reg_nr,
                customer_nr = @customer_nr,
                website = @website,
                default_airport = @default_airport,
                currency = @currency,
                discount = @discount,
                commission = @commission,
                default_commission = @default_commission,
                notes = @notes,
                legal_representative = @legal_representative
            WHERE id = @id
        `);

        // Verwijder bestaande adressen
        await pool.request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('DELETE FROM contact_addresses WHERE contact_id = @contact_id');

        // Voeg nieuwe adressen toe
        if (Array.isArray(contact.addresses)) {
            for (const addr of contact.addresses) {
                await pool.request()
                    .input('contact_id', sql.UniqueIdentifier, id)
                    .input('label', sql.NVarChar, addr.label)
                    .input('address', sql.NVarChar, addr.address)
                    .input('zip', sql.NVarChar, addr.zip)
                    .input('city', sql.NVarChar, addr.city)
                    .input('country', sql.NVarChar, addr.country)
                    .input('longitude', sql.Float, addr.longitude ?? null)  // Voeg longitude toe
                    .input('latitude', sql.Float, addr.latitude ?? null)    // Voeg latitude toe
                    .input('show_on_locator_map', sql.Bit, addr.show_on_locator_map ?? false)
                    .query(`
                        INSERT INTO contact_addresses (contact_id, label, address, zip, city, country, longitude, latitude, show_on_locator_map)
                        VALUES (@contact_id, @label, @address, @zip, @city, @country, @longitude, @latitude, @show_on_locator_map)
                    `);
            }
        }

        // Verwijder bestaande e-mails
        await pool.request()
        .input('contact_id', sql.UniqueIdentifier, id)
        .query('DELETE FROM contact_emails WHERE contact_id = @contact_id');

        // Voeg nieuwe e-mails toe
        if (Array.isArray(contact.emails)) {
        for (const email of contact.emails) {
            await pool.request()
                .input('contact_id', sql.UniqueIdentifier, id)
                .input('email', sql.NVarChar, email.email)
                .input('label', sql.NVarChar, email.label ?? null)
                .query(`
                    INSERT INTO contact_emails (contact_id, email, label)
                    VALUES (@contact_id, @email, @label)
                `);
        }
        }

        // Verwijder bestaande telefoonnummers
        await pool.request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('DELETE FROM contact_phone_numbers WHERE contact_id = @contact_id');

        // Voeg nieuwe telefoonnummers toe
        if (Array.isArray(contact.phoneNumbers)) {
            for (const phone of contact.phoneNumbers) {
                await pool.request()
                    .input('contact_id', sql.UniqueIdentifier, id)
                    .input('country', sql.NVarChar, phone.country)
                    .input('phoneNumber', sql.NVarChar, phone.phoneNumber)
                    .input('label', sql.NVarChar, phone.label)
                    .query(`
                        INSERT INTO contact_phone_numbers (contact_id, country, phone_number, label)
                        VALUES (@contact_id, @country, @phoneNumber, @label)
                    `);
            }
        }

        res.status(200).json({ id, message: 'Contact updated' });
    } catch (err) {
        console.error('❌ Error in PATCH /contacts/:id:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/contacts - haal alle contacten op
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query('SELECT * FROM contacts');

        const contacts = result.recordset;

        // Voeg eventueel ook de adressen en telefoons toe
        for (const contact of contacts) {
            const [addresses, phones, agent, users, emails] = await Promise.all([
                pool.request()
                    .input('contact_id', sql.UniqueIdentifier, contact.id)
                    .query('SELECT * FROM contact_addresses WHERE contact_id = @contact_id'),
                pool.request()
                    .input('contact_id', sql.UniqueIdentifier, contact.id)
                    .query('SELECT * FROM contact_phone_numbers WHERE contact_id = @contact_id'),
                contact.agent_id
                    ? pool.request()
                        .input('agent_id', sql.UniqueIdentifier, contact.agent_id)
                        .query('SELECT company FROM contacts WHERE id = @agent_id')
                    : Promise.resolve({ recordset: [] }),
                pool.request()
                    .input('contact_id', sql.UniqueIdentifier, contact.id)
                    .query('SELECT first_name, last_name FROM users WHERE company_id = @contact_id'),
                pool.request()
                    .input('contact_id', sql.UniqueIdentifier, contact.id)
                    .query('SELECT * FROM contact_emails WHERE contact_id = @contact_id') // 👈 voeg deze toe
            ]);

            contact.addresses = addresses.recordset;
            contact.emails = emails.recordset;
            contact.phoneNumbers = phones.recordset;
            contact.agentName = agent.recordset[0]?.company ?? null;
            contact.users = users.recordset; // Voeg de gebruikers toe aan het contact
            
            // 🔍 Zoek billing-adres
            const billingAddress = addresses.recordset.find(addr => addr.label?.toLowerCase() === 'billing');
            contact.billingCountry = billingAddress?.country || null;
        }

        res.status(200).json(contacts);
    } catch (err) {
        console.error('❌ Error fetching contacts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET /api/contacts/agents
router.get('/agents', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query("SELECT id, company, default_commission FROM contacts WHERE type = 'Agent'");
        
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Error fetching agents:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const pool = await poolPromise;

        // Eerst verwijderen uit child-tabellen (foreign keys!)
        await pool.request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('DELETE FROM contact_addresses WHERE contact_id = @contact_id');

        await pool.request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('DELETE FROM contact_phone_numbers WHERE contact_id = @contact_id');

        // Dan hoofdcontact verwijderen
        await pool.request()
            .input('id', sql.UniqueIdentifier, id)
            .query('DELETE FROM contacts WHERE id = @id');

        await pool.request()
        .input('contact_id', sql.UniqueIdentifier, id)
        .query('DELETE FROM contact_emails WHERE contact_id = @contact_id');

        res.status(200).json(true);
    } catch (err) {
        console.error('❌ Error deleting contact:', err);
        res.status(500).json(false);
    }
});

// GET /api/contacts/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log('🔎 ID ontvangen in GET /contacts/:id:', id); // <- voeg dit toe
    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('id', sql.UniqueIdentifier, id)
            .query('SELECT * FROM contacts WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const contact = result.recordset[0];

        // Haal addresses op
        const addresses = await pool
            .request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('SELECT * FROM contact_addresses WHERE contact_id = @contact_id');

        // Haal telefoonnummers op
        const phones = await pool
            .request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('SELECT * FROM contact_phone_numbers WHERE contact_id = @contact_id');

            // Haal e-mails op
        const emails = await pool
            .request()
            .input('contact_id', sql.UniqueIdentifier, id)
            .query('SELECT * FROM contact_emails WHERE contact_id = @contact_id');

        contact.emails = emails.recordset;
        contact.addresses = addresses.recordset;
        contact.phoneNumbers = phones.recordset;

        // 🔍 Zoek billing-adres
        const billingAddress = addresses.recordset.find(addr => addr.label?.toLowerCase() === 'billing');
        contact.billingCountry = billingAddress?.country || null;

        // ✅ Voeg agentName toe indien dealer
        if (contact.type === 'Dealer' && contact.agent_id) {
            const agentResult = await pool
                .request()
                .input('agent_id', sql.UniqueIdentifier, contact.agent_id)
                .query('SELECT company FROM contacts WHERE id = @agent_id');

            contact.agentName = agentResult.recordset[0]?.company || null;
        }
        console.log('📤 Verstuur contact:', contact);
        return res.status(200).json(contact);
    } catch (err) {
        console.error('❌ Error fetching contact by ID:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/contacts/search?query=xxx
router.get('/search', async (req, res) => {
    const query = req.query.query;

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .input('query', sql.NVarChar, `%${query}%`)
            .query(`
                SELECT * FROM contacts
                WHERE name LIKE @query OR company LIKE @query
            `);

        const contacts = result.recordset;

        res.status(200).json(contacts);
    } catch (err) {
        console.error('❌ Error searching contacts:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id/active', async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    try {

        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.UniqueIdentifier, id)
            .input('active', sql.Bit, active)
            .query(`
                UPDATE contacts
                SET active = @active
                WHERE id = @id
            `);

        res.status(200).json({ message: 'Contact status updated' });
    } catch (error) {
        console.error('Update failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;