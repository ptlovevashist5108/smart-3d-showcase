const db = require('./config/db');

const fname = process.argv[2];
if (!fname) {
  console.error('Usage: node setBossPhoto.js <filename>  (e.g. 1786601021328-258574342.jpeg)');
  process.exit(1);
}

const bossPath = fname.startsWith('/uploads/') ? fname : `/uploads/${fname}`;

(async () => {
  try {
    const [result] = await db.query('UPDATE admins SET boss_photo = ? WHERE id = ?', [bossPath, 1]);
    console.log('Updated boss_photo to', bossPath);
    process.exit(0);
  } catch (err) {
    console.error('DB update failed:', err.message || err);
    process.exit(2);
  }
})();
