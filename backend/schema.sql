-- Run this file first to set up the database
-- Usage: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS kavita_slimming_point;
USE kavita_slimming_point;

-- Admin users table (for login-protected product management)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (data shown on the 3D showcase site)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  color VARCHAR(20) DEFAULT '#6366f1',
  shape ENUM('box','sphere','torus','cylinder','cone') DEFAULT 'box',
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form / leads table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real services offered — prices set to 0, update them from the Admin Dashboard
INSERT INTO products (name, description, price, color, shape, featured) VALUES
('EMS', 'Electrical Muscle Stimulation therapy to tone and strengthen muscles without heavy workouts.', 0, '#ec4899', 'torus', TRUE),
('Deep Heat', 'Deep heat therapy to relax muscles, improve circulation and relieve stiffness.', 0, '#f97316', 'box', FALSE),
('G5 Massager', 'Mechanical vibration massage that helps break down fat and improve muscle tone.', 0, '#a855f7', 'cylinder', FALSE),
('Vacuum Therapy (Bipolar)', 'Bipolar vacuum therapy to reduce cellulite and reshape target areas.', 0, '#3b82f6', 'sphere', TRUE),
('Lipolaser', 'Low-level laser treatment that targets stubborn fat for a slimmer contour.', 0, '#ef4444', 'cone', FALSE),
('Cavitation', 'Ultrasonic cavitation to break down fat cells for non-invasive body sculpting.', 0, '#14b8a6', 'sphere', FALSE),
('Body RF', 'Radio Frequency treatment to tighten skin and improve overall body firmness.', 0, '#8b5cf6', 'box', FALSE),
('Tucks', 'Targeted body tuck treatment for a smoother, more defined shape.', 0, '#f59e0b', 'cylinder', FALSE),
('Heat Blanket', 'Full-body heat blanket session to promote detox and relaxation.', 0, '#dc2626', 'box', FALSE);
