-- Run this file in MySQL to create the database and tables
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author VARCHAR(100) NOT NULL,
  genre VARCHAR(50),
  isbn VARCHAR(20) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  membership_id VARCHAR(30) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'member'
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  type VARCHAR(10) NOT NULL,        -- 'add' or 'deduct'
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Starter data so you can log in the first time
INSERT INTO users (name, membership_id, role) VALUES
  ('Admin', 'ADMIN001', 'admin'),
  ('John Member', 'MEM001', 'member');

INSERT INTO books (title, author, genre, isbn, quantity) VALUES
  ('Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5),
  ('Clean Code', 'Robert C. Martin', 'Programming', '9780132350884', 1),
  ('Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 3);
