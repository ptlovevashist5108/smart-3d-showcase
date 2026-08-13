const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kavita_slimming_point',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use promise-based pool for async/await support
const db = pool.promise();

(async () => {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM admins LIKE 'boss_photo'");
    if (rows.length === 0) {
      await db.query('ALTER TABLE admins ADD COLUMN boss_photo VARCHAR(500) DEFAULT NULL');
    }
    // Ensure audit table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_audit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Ensure contacts table has phone column
    const [crows] = await db.query("SHOW COLUMNS FROM contacts LIKE 'phone'");
    if (crows.length === 0) {
      await db.query("ALTER TABLE contacts ADD COLUMN phone VARCHAR(40) DEFAULT NULL");
    }
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
})();

module.exports = db;
