package com.alumniconnect.scheduler;

import com.alumniconnect.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobExpiryScheduler {

    private final JobRepository jobRepository;

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void expireOldJobs() {
        log.info("Running job expiry scheduler...");

        int expiredCount = jobRepository.expireOldJobs(LocalDateTime.now());

        if (expiredCount > 0) {
            log.info("Expired {} jobs", expiredCount);
        }
    }
}
