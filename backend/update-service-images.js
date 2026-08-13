const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const sql = `UPDATE products SET image_url = CASE id
  WHEN 1 THEN 'https://www.bellezastars.com/wp-content/uploads/2026/01/High-Effective-Muscle-Electromagnetic-Ems-Shaping-Cryotherapy-Body-Slimming-Weight-Loss-Beauty-Equipment.jpg'
  WHEN 2 THEN 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  WHEN 3 THEN 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
  WHEN 4 THEN 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  WHEN 5 THEN 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  WHEN 6 THEN 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  WHEN 7 THEN 'https://images.unsplash.com/photo-1587500152840-9a1c1f827e72?auto=format&fit=crop&w=800&q=80'
  WHEN 8 THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  WHEN 9 THEN 'https://images.unsplash.com/photo-1597878701605-0f592b74121b?auto=format&fit=crop&w=800&q=80'
  WHEN 10 THEN 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  WHEN 11 THEN 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=800&q=80'
  WHEN 12 THEN 'https://images.unsplash.com/photo-1496317556649-f930d733eea2?auto=format&fit=crop&w=800&q=80'
  WHEN 13 THEN 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  ELSE image_url END WHERE id BETWEEN 1 AND 13;`;

pool.query(sql, (err) => {
  if (err) {
    console.error('UPDATE_ERR', err.message);
    process.exit(1);
  }
  console.log('IMAGE_URLS_UPDATED');
  process.exit(0);
});
