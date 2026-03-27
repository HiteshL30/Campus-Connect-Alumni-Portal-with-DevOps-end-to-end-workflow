package com.alumniconnect.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<Long, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // 10 interview sessions per hour per user
        return Bucket.builder()
                .addLimit(Bandwidth.builder().capacity(10).refillGreedy(10, Duration.ofHours(1)).build())
                .build();
    }

    public boolean isAllowed(Long userId) {
        Bucket bucket = buckets.computeIfAbsent(userId, k -> createNewBucket());
        return bucket.tryConsume(1);
    }
}
