package com.alumniconnect.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitServiceTest {

    private RateLimitService rateLimitService;

    @BeforeEach
    void setUp() {
        rateLimitService = new RateLimitService();
    }

    @Test
    void testRateLimiting() {
        Long userId = 1L;
        
        // Consume 10
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimitService.isAllowed(userId), "Call " + i + " should be allowed");
        }
        
        // 11th should be blocked
        assertFalse(rateLimitService.isAllowed(userId), "11th call should be blocked");
    }

    @Test
    void testSeparateBucketsForUsers() {
        Long user1 = 1L;
        Long user2 = 2L;

        for (int i = 0; i < 10; i++) {
            rateLimitService.isAllowed(user1);
        }

        assertFalse(rateLimitService.isAllowed(user1));
        assertTrue(rateLimitService.isAllowed(user2), "User2 should have their own bucket");
    }
}
