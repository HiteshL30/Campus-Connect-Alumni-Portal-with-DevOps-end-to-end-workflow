-- Migration Script: Update FACULTY role to ADMIN
-- This fixes the JSON deserialization error caused by the FACULTY enum value
-- which was replaced with ADMIN in the codebase

USE alumni_connect;

-- Update all users with FACULTY role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE role = 'FACULTY';

-- Verify the update
SELECT role, COUNT(*) as count FROM users GROUP BY role;
