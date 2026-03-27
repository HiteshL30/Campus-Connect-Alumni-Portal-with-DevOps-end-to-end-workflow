-- Fix User Disabled Login Error
-- This script enables all existing users in the database

USE alumni_connect;

-- Show current state
SELECT 'BEFORE - User account status:' as info;
SELECT id, email, role, is_active, is_locked, verified
FROM users
ORDER BY id;

-- Enable all users (set is_active = true)
UPDATE users 
SET is_active = true 
WHERE is_active = false OR is_active IS NULL;

-- Unlock all users (set is_locked = false)
UPDATE users 
SET is_locked = false 
WHERE is_locked = true OR is_locked IS NULL;

-- Show updated state
SELECT 'AFTER - User account status:' as info;
SELECT id, email, role, is_active, is_locked, verified
FROM users
ORDER BY id;

-- Summary
SELECT 'Summary:' as info;
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_users,
    SUM(CASE WHEN is_locked = true THEN 1 ELSE 0 END) as locked_users,
    SUM(CASE WHEN verified = true THEN 1 ELSE 0 END) as verified_users
FROM users;
