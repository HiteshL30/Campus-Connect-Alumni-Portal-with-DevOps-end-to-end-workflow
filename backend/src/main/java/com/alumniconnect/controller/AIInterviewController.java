package com.alumniconnect.controller;

import com.alumniconnect.dto.ai.*;
import com.alumniconnect.entity.InterviewSession;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.MockInterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Slf4j
@RestController
@RequestMapping("/api/ai/interview")
@RequiredArgsConstructor
public class AIInterviewController {

    private final MockInterviewService mockInterviewService;
    private final UserRepository userRepository;

    // Simple in-memory rate limiter per "Start Interview" session
    private final Map<Long, Deque<LocalDateTime>> requestHistory = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_HOUR = 10;

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(@Valid @RequestBody StartInterviewRequest request, Authentication authentication) {
        log.info("Interview start request received for user: {}", authentication.getName());
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != com.alumniconnect.entity.Role.STUDENT && user.getRole() != com.alumniconnect.entity.Role.ALUMNI) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only students and alumni can practice interviews."));
            }

            if (isRateLimited(user.getId())) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of("error", "Rate limit exceeded. Maximum 10 mock interviews per hour."));
            }

            InterviewQuestionResponse response = mockInterviewService.startInterview(request.getRole(), user.getEmail());
            recordRequest(user.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to start AI interview", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to start interview: " + e.getMessage()));
        }
    }

    @PostMapping("/answer")
    public ResponseEntity<?> submitAnswer(@Valid @RequestBody SubmitAnswerRequest request, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != com.alumniconnect.entity.Role.STUDENT && user.getRole() != com.alumniconnect.entity.Role.ALUMNI) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only students and alumni can practice interviews."));
            }

            SubmitAnswerResponse response = mockInterviewService.submitAnswer(request, user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to process interview answer", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process answer: " + e.getMessage()));
        }
    }

    @PostMapping("/finish/{sessionId}")
    public ResponseEntity<?> forceFinishInterview(@PathVariable("sessionId") Long sessionId, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != com.alumniconnect.entity.Role.STUDENT && user.getRole() != com.alumniconnect.entity.Role.ALUMNI) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only students and alumni can practice interviews."));
            }

            InterviewSummaryResponse response = mockInterviewService.forceFinishInterview(sessionId, user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to finish interview", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to finish interview: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != com.alumniconnect.entity.Role.STUDENT && user.getRole() != com.alumniconnect.entity.Role.ALUMNI) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only students and alumni can view history."));
            }

            List<InterviewSession> history = mockInterviewService.getHistory(user.getEmail());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Failed to fetch interview history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch history: " + e.getMessage()));
        }
    }

    private boolean isRateLimited(Long userId) {
        Deque<LocalDateTime> history = requestHistory.getOrDefault(userId, new ConcurrentLinkedDeque<>());
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);

        // Clean up old entries
        while (!history.isEmpty() && history.peekFirst().isBefore(oneHourAgo)) {
            history.pollFirst();
        }

        requestHistory.put(userId, history);
        return history.size() >= MAX_REQUESTS_PER_HOUR;
    }

    private void recordRequest(Long userId) {
        Deque<LocalDateTime> history = requestHistory.getOrDefault(userId, new ConcurrentLinkedDeque<>());
        history.addLast(LocalDateTime.now());
        requestHistory.put(userId, history);
    }
}
