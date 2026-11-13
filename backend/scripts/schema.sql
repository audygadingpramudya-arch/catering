CREATE DATABASE IF NOT EXISTS catering_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE catering_db;

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menus (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INT UNSIGNED NOT NULL DEFAULT 0,
  description TEXT NULL,
  image VARCHAR(255) NULL,
  popular TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_menus_category (category),
  KEY idx_menus_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT 'Pelanggan',
  message TEXT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  image VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  business_name VARCHAR(150) NOT NULL DEFAULT 'Ar Rahman Catering',
  tagline VARCHAR(255) NOT NULL DEFAULT 'Catering Halal Terpercaya',
  hero_title VARCHAR(255) NOT NULL DEFAULT 'Lezat & Praktis untuk Setiap Acara Anda',
  hero_description TEXT NULL,
  about_title VARCHAR(255) NOT NULL DEFAULT 'Catering Pilihan Keluarga Indonesia',
  about_description TEXT NULL,
  whatsapp VARCHAR(30) NOT NULL DEFAULT '',
  instagram VARCHAR(255) NOT NULL DEFAULT '',
  facebook VARCHAR(255) NOT NULL DEFAULT '',
  address VARCHAR(255) NOT NULL DEFAULT '',
  opening_hours VARCHAR(150) NOT NULL DEFAULT '',
  maps_url VARCHAR(500) NOT NULL DEFAULT '',
  logo VARCHAR(255) NULL,
  hero_image VARCHAR(255) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_settings
  (id, business_name, tagline, hero_title, hero_description, about_title,
   about_description, whatsapp, instagram, facebook, address, opening_hours,
   maps_url, logo, hero_image)
VALUES
  (1, 'Ar Rahman Catering', 'Catering Halal Terpercaya',
   'Lezat & Praktis untuk Setiap Acara Anda',
   'Ar Rahman Catering menyediakan nasi box, prasmanan, dan menu syukuran dengan cita rasa rumahan, harga terjangkau, dan pengiriman tepat waktu.',
   'Catering Pilihan Keluarga Indonesia',
   'Lebih dari 10 tahun melayani kebutuhan catering harian, acara kantor, hingga perayaan besar.',
   '6282142128202', '', '', 'Kota dan Kabupaten sekitarnya',
   'Setiap Hari, 07.00 - 20.00 WIB', '', '/images/logo.jpg', '/images/hero.jpg');

INSERT IGNORE INTO menus
  (id, name, category, price, description, image, popular, is_active)
VALUES
  (1, 'Nasi Box Ayam Bakar', 'Nasi Box', 15000, 'Nasi box dengan ayam bakar, sayuran dan sambal', '/images/ayam-bakar.jpg', 1, 1),
  (2, 'Nasi Box Ayam Goreng', 'Nasi Box', 14000, 'Nasi box dengan ayam goreng, sayuran dan sambal', '/images/nasi-box.jpg', 1, 1),
  (3, 'Nasi Goreng Spesial', 'Nasi Box', 14000, 'Nasi goreng spesial dengan ayam dan sayuran', '/images/nasi-goreng.jpg', 1, 1),
  (4, 'Paket Prasmanan', 'Prasmanan', 25000, 'Prasmanan lengkap dengan 5 pilihan lauk dan sayuran', '/images/prasmanan.jpg', 0, 1),
  (5, 'Nasi Tumpeng Syukuran', 'Acara', 250000, 'Nasi tumpeng lengkap untuk acara syukuran dan perayaan', '/images/tumpeng.jpg', 0, 1);

INSERT IGNORE INTO testimonials (id, name, role, message, rating, is_active)
VALUES
  (1, 'Andi Pratama', 'Pelanggan Catering', 'Makanannya enak, porsinya banyak dan pengirimannya tepat waktu.', 5, 1),
  (2, 'Siti Rahma', 'Pelanggan Acara', 'Pelayanan sangat baik. Menu prasmanannya juga sangat memuaskan.', 5, 1),
  (3, 'Budi Santoso', 'Pelanggan Kantor', 'Catering cocok untuk kebutuhan makan siang karyawan.', 5, 1);

INSERT IGNORE INTO gallery (id, title, image, sort_order)
VALUES
  (1, 'Nasi box catering', '/images/nasi-box.jpg', 1),
  (2, 'Ayam bakar', '/images/ayam-bakar.jpg', 2),
  (3, 'Prasmanan', '/images/prasmanan.jpg', 3),
  (4, 'Nasi tumpeng', '/images/tumpeng.jpg', 4),
  (5, 'Buffet prasmanan', '/images/buffet.jpg', 5),
  (6, 'Hidangan lengkap', '/images/catering.jpg', 6);
