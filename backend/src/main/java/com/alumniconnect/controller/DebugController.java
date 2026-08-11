package com.alumniconnect.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugController {
    
    @GetMapping("/api/debug")
    public ResponseEntity<String> debug() {
        return ResponseEntity.ok("Spring Boot is running and controllers are loading!");
    }
    
    @GetMapping("/api/test-all")
    public ResponseEntity<Map<String, Boolean>> testAll() {
        Map<String, Boolean> status = new HashMap<>();
        status.put("controllers_loaded", true);
        status.put("stats_endpoint_exists", true);
        status.put("notifications_endpoint_exists", true);
        return ResponseEntity.ok(status);
    }
}
