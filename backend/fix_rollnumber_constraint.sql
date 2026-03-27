-- Fix rollNumber unique constraint issue
-- This allows multiple users (ADMIN) to have NULL/empty roll numbers

USE alumni_connect;

-- Drop the unique constraint on roll_number
ALTER TABLE users DROP INDEX UK_bav7qiaas16cr7jn0eb4n7fy0;

-- Optionally: Clean up any existing empty roll_number entries for ADMIN users
UPDATE users SET roll_number = NULL WHERE role = 'ADMIN' AND (roll_number = '' OR roll_number IS NULL);

-- Verify
SELECT role, roll_number, COUNT(*) FROM users GROUP BY role, roll_number;
