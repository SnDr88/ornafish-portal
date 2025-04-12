const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
    },
};

async function createUsersTable() {
    try {
        console.log('🔧 Connecting to database...');
        await sql.connect(config);

        const query = `
            IF NOT EXISTS (
                SELECT * FROM sysobjects WHERE name='users' AND xtype='U'
            )
            CREATE TABLE users (
                id INT IDENTITY(1,1) PRIMARY KEY,
                email NVARCHAR(255) NOT NULL UNIQUE,
                password NVARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT GETDATE()
            );
        `;

        await sql.query(query);
        console.log('✅ "users" table created or already exists.');

        sql.close();
    } catch (err) {
        console.error('❌ Error creating users table:', err);
        sql.close();
    }
}

createUsersTable();