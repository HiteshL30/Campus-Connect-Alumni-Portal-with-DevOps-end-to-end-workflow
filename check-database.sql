-- Run this to verify database exists
SHOW DATABASES;

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS alumni_connect;
USE alumni_connect;

-- Show tables
SHOW TABLES;

-- Check users
SELECT COUNT(*) as user_count FROM users;
