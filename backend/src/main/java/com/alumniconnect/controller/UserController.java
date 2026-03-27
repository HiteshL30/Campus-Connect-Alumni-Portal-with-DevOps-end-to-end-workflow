package com.alumniconnect.controller;

import com.alumniconnect.dto.UserDTO;
import com.alumniconnect.dto.UserProfileDTO;
import com.alumniconnect.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateCurrentUserProfile(@RequestBody UserProfileDTO profileDTO) {
        return ResponseEntity.ok(userService.updateCurrentUserProfile(profileDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserProfileById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(userService.getUserProfileById(id));
    }

    @GetMapping("/unverified")
    public ResponseEntity<List<UserDTO>> getUnverifiedByDepartment(@RequestParam("department") String department) {
        return ResponseEntity.ok(userService.getUnverifiedByDepartment(department));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<Void> verifyUser(@PathVariable("id") Long id) {
        userService.verifyUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<com.alumniconnect.dto.UserStatsDTO> getUserStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }
}
