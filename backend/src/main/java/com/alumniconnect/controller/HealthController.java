package com.alumniconnect.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
public class HealthController {
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", new Date());
        status.put("message", "Backend is running!");
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/api/test-health")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is accessible!");
    }
}
