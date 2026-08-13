const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC LIMIT 10');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Query failed:', err.message || err);
    process.exit(2);
  }
})();
