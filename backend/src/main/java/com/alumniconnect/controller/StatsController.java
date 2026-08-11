package com.alumniconnect.controller;

import com.alumniconnect.entity.User;
import com.alumniconnect.service.StatsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@Slf4j
public class StatsController {
    
    @Autowired
    private StatsService statsService;
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Stats controller is working!");
    }

    @GetMapping("/sidebar")
    public ResponseEntity<Map<String, Object>> getSidebarStats(
            @AuthenticationPrincipal User currentUser) {
        
        System.out.println(">>> StatsController.sidebar() CALLED <<<"); // Debug line
        log.info("=== SIDEBAR STATS REQUEST ===");
        log.info("Current user object: {}", currentUser);
        
        if (currentUser == null) {
            log.warn("User is null - returning 401");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        log.info("User ID: {}", currentUser.getId());
        log.info("User Role: {}", currentUser.getRole());
        
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Base stats for all users
            stats.put("connectionCount", statsService.getConnectionCount(currentUser.getId()));
            stats.put("pendingRequestsCount", statsService.getPendingRequestsCount(currentUser.getId()));
            
            // Role-specific stats
            String role = currentUser.getRole().toString();
            if ("STUDENT".equals(role)) {
                stats.put("savedJobsCount", statsService.getSavedJobsCount(currentUser.getId()));
                stats.put("appliedJobsCount", statsService.getAppliedJobsCount(currentUser.getId()));
                log.info("Student stats: connections={}, pending={}, saved={}, applied={}", 
                    stats.get("connectionCount"), stats.get("pendingRequestsCount"),
                    stats.get("savedJobsCount"), stats.get("appliedJobsCount"));
            } 
            else if ("ALUMNI".equals(role)) {
                stats.put("jobPostingsCount", statsService.getJobPostingsCount(currentUser.getId()));
                stats.put("totalApplicantsCount", statsService.getTotalApplicantsCount(currentUser.getId()));
                log.info("Alumni stats: connections={}, pending={}, postings={}, applicants={}",
                    stats.get("connectionCount"), stats.get("pendingRequestsCount"),
                    stats.get("jobPostingsCount"), stats.get("totalApplicantsCount"));
            }
            else {
                // ADMIN role
                log.info("Admin stats request");
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            log.error("Unexpected error in sidebar stats", e);
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("connectionCount", 0);
            errorStats.put("pendingRequestsCount", 0);
            errorStats.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorStats);
        }
    }
}
