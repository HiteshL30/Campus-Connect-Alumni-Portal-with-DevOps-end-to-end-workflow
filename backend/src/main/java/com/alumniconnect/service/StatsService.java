package com.alumniconnect.service;

import com.alumniconnect.repository.ConnectionRepository;
import com.alumniconnect.repository.JobRepository;
import com.alumniconnect.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StatsService {
    
    @Autowired(required = false)
    private ConnectionRepository connectionRepository;
    
    @Autowired(required = false)
    private JobRepository jobRepository;
    
    @Autowired(required = false)
    private UserRepository userRepository;
    
    public int getConnectionCount(Long userId) {
        try {
            if (connectionRepository == null) return 0;
            return connectionRepository.countAcceptedConnectionsNative(userId);
        } catch (Exception e) {
            log.warn("Failed to get connection count for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
    
    public int getPendingRequestsCount(Long userId) {
        try {
            if (connectionRepository == null) return 0;
            return connectionRepository.countPendingRequestsNative(userId);
        } catch (Exception e) {
            log.warn("Failed to get pending requests for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
    
    public int getSavedJobsCount(Long userId) {
        try {
            if (jobRepository == null) return 0;
            return jobRepository.countSavedJobsByUser(userId);
        } catch (Exception e) {
            log.warn("Failed to get saved jobs for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
    
    public int getAppliedJobsCount(Long userId) {
        try {
            if (jobRepository == null) return 0;
            return jobRepository.countAppliedJobsByUser(userId);
        } catch (Exception e) {
            log.warn("Failed to get applied jobs for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
    
    public int getJobPostingsCount(Long userId) {
        try {
            if (jobRepository == null) return 0;
            return jobRepository.countByPostedByIdNative(userId);
        } catch (Exception e) {
            log.warn("Failed to get job postings for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
    
    public int getTotalApplicantsCount(Long userId) {
        try {
            if (jobRepository == null) return 0;
            return jobRepository.countTotalApplicantsForUserJobs(userId);
        } catch (Exception e) {
            log.warn("Failed to get total applicants for user {}: {}", userId, e.getMessage());
            return 0;
        }
    }
}
