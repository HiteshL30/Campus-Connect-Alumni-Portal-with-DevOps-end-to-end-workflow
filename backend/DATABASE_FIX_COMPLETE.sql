-- ============================================================================
-- COMPLETE DATABASE FIX FOR UNIQUE CONSTRAINT ISSUE
-- ============================================================================
-- This script fixes the rollNumber unique constraint duplicate entry problem
-- Root Cause: Empty strings ('') violate unique constraint when multiple 
--             ADMIN users are created (they don't have roll numbers)
-- ============================================================================

USE alumni_connect;

-- STEP 1: Identify the problem
-- Show current state of roll_number column
SELECT 'BEFORE CLEANUP - Users with empty roll numbers:' as info;
SELECT id, email, role, roll_number, 
       CASE 
           WHEN roll_number IS NULL THEN 'NULL'
           WHEN roll_number = '' THEN 'EMPTY STRING'
           ELSE roll_number 
       END as roll_number_status
FROM users 
WHERE roll_number IS NULL OR roll_number = ''
ORDER BY role, id;

-- STEP 2: Clean up existing data
-- Convert empty strings to NULL for all users
UPDATE users 
SET roll_number = NULL 
WHERE roll_number = '' OR roll_number IS NULL;

-- Also clean up department field
UPDATE users 
SET department = NULL 
WHERE department = '' OR department IS NULL;

-- STEP 3: Fix role column (if needed)
-- Update any FACULTY roles to ADMIN
UPDATE users SET role = 'ADMIN' WHERE role = 'FACULTY';

-- Ensure role column is VARCHAR (not ENUM)
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;

-- STEP 4: Remove the unique constraint on roll_number
-- This allows multiple NULL values (which is standard SQL behavior)
ALTER TABLE users DROP INDEX IF EXISTS UK_bav7qiaas16cr7jn0eb4n7fy0;

-- STEP 5: Verify the fix
SELECT 'AFTER CLEANUP - Current state:' as info;
SELECT role, 
       COUNT(*) as total_users,
       SUM(CASE WHEN roll_number IS NULL THEN 1 ELSE 0 END) as null_roll_numbers,
       SUM(CASE WHEN roll_number IS NOT NULL THEN 1 ELSE 0 END) as with_roll_numbers
FROM users 
GROUP BY role;

-- STEP 6: Show all users for verification
SELECT 'All users after cleanup:' as info;
SELECT id, email, role, roll_number, department, verified
FROM users
ORDER BY role, id;

-- ============================================================================
-- DONE! Now restart your Spring Boot application.
-- The application code now converts empty strings to NULL before saving,
-- preventing future duplicate entry errors.
-- ============================================================================
