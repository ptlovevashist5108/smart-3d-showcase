const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kavita_slimming_point',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

console.log('Database config: host=', dbConfig.host, 'port=', dbConfig.port, 'database=', dbConfig.database, 'user=', dbConfig.user);

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

const ensureSchema = async () => {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM admins LIKE 'boss_photo'");
    if (rows.length === 0) {
      await db.query('ALTER TABLE admins ADD COLUMN boss_photo VARCHAR(500) DEFAULT NULL');
    }

    const [irows] = await db.query("SHOW COLUMNS FROM admins LIKE 'instagram_url'");
    if (irows.length === 0) {
      await db.query('ALTER TABLE admins ADD COLUMN instagram_url VARCHAR(500) DEFAULT NULL');
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_audit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS snapshots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(500) NOT NULL,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [crows] = await db.query("SHOW COLUMNS FROM contacts LIKE 'phone'");
    if (crows.length === 0) {
      await db.query("ALTER TABLE contacts ADD COLUMN phone VARCHAR(40) DEFAULT NULL");
    }

    console.log('✅ Database schema check passed.');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    console.error('DB host:', dbConfig.host);
    console.error('DB port:', dbConfig.port);
    console.error('DB name:', dbConfig.database);
    console.error('DB user:', dbConfig.user);
    throw err;
  }
};

module.exports = db;
module.exports.ensureSchema = ensureSchema;
