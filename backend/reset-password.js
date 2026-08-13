const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // New password (you can change this)
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the first admin's password
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE admins SET password = ? LIMIT 1',
      [hashedPassword]
    );

    if (result.affectedRows > 0) {
      console.log('✓ Password reset successfully!');
      console.log(`New password: ${newPassword}`);
    } else {
      console.log('✗ No admin found to update.');
    }

    connection.release();
  } catch (err) {
    console.error('Error resetting password:', err.message);
  } finally {
    await pool.end();
  }
};

resetPassword();
