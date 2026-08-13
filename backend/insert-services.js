const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

const sql = `INSERT INTO products (name, description, price, color, shape, featured) VALUES
('EMS Therapy', 'Electric muscle stimulation treatment for toning and slimming.', 2499.00, '#ec4899', 'box', TRUE),
('Deep Heat Therapy', 'Heat therapy session to support slimming and muscle relaxation.', 999.00, '#f97316', 'cylinder', TRUE),
('G5 Massager', 'Mechanical massage with G5 device for improved lymphatic flow.', 1599.00, '#a855f7', 'sphere', FALSE),
('Vacuum Therapy (Bipolar)', 'Vacuum suction therapy targeting cellulite and body contouring.', 1999.00, '#10b981', 'torus', FALSE),
('Lipolaser', 'Non-invasive laser fat reduction session.', 2999.00, '#3b82f6', 'cone', TRUE),
('Cavitation', 'Ultrasonic cavitation for localized fat breakdown.', 2799.00, '#fb7185', 'box', FALSE),
('Body RF', 'Radiofrequency body tightening and slimming treatment.', 2699.00, '#8b5cf6', 'sphere', TRUE),
('Tucks', 'Targeted tuck-and-tone therapy for body shaping.', 1299.00, '#f59e0b', 'cylinder', FALSE),
('Heat Blanket', 'Thermal blanket treatment for detox and slimming.', 1199.00, '#14b8a6', 'torus', FALSE);
`;

pool.query(sql, (err) => {
  if (err) {
    console.error('INSERT_ERR', err.message);
    process.exit(1);
  }
  console.log('SERVICES_INSERTED');
  process.exit(0);
});
