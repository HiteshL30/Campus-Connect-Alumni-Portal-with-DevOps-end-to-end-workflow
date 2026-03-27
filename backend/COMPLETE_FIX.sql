-- COMPLETE FIX: Run this entire script to fix all role and rollNumber issues
-- This is a consolidated script that fixes everything in one go

USE alumni_connect;

-- Step 1: Update FACULTY to ADMIN
UPDATE users SET role = 'ADMIN' WHERE role = 'FACULTY';

-- Step 2: Fix role column type
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;

-- Step 3: Drop the unique constraint on roll_number
ALTER TABLE users DROP INDEX IF EXISTS UK_bav7qiaas16cr7jn0eb4n7fy0;

-- Step 4: Clean up empty roll numbers for ADMIN users
UPDATE users SET roll_number = NULL WHERE role = 'ADMIN' AND (roll_number = '' OR roll_number IS NULL);

-- Step 5: Verify the changes
SELECT 'Users by role:' as info;
SELECT role, COUNT(*) as count FROM users GROUP BY role;

SELECT 'Roll numbers:' as info;
SELECT role, roll_number, COUNT(*) FROM users GROUP BY role, roll_number;

-- Done! Now restart your Spring Boot application.
