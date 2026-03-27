-- Complete Database Migration: Fix Role Column
-- This script fixes the role column to support [STUDENT, ALUMNI, ADMIN]

USE alumni_connect;

-- Step 1: Update existing FACULTY records to ADMIN
UPDATE users SET role = 'ADMIN' WHERE role = 'FACULTY';

-- Step 2: Drop the old role column if it's an ENUM type
-- and recreate it as VARCHAR to avoid enum constraints
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;

-- Step 3: Verify the changes
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Expected output: Only STUDENT, ALUMNI, ADMIN should appear
