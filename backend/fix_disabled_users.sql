-- ============================================================================
-- FIX DISABLED USERS
-- Run this script to activate all existing users in the database
-- ============================================================================

USE alumni_connect;

-- Show current state
SELECT 'BEFORE FIX - Disabled/unverified users:' as info;
SELECT id, email, role, is_active, verified FROM users WHERE is_active = 0 OR verified = 0;

-- Activate all users
UPDATE users SET is_active = 1 WHERE is_active = 0;

-- Verify all users
UPDATE users SET verified = 1 WHERE verified = 0;

-- Show result
SELECT 'AFTER FIX - All users:' as info;
SELECT id, email, role, is_active, verified FROM users;

-- ============================================================================
-- DONE! Restart the Spring Boot application after running this script.
-- ============================================================================
