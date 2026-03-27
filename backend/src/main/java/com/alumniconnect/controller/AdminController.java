package com.alumniconnect.controller;

import com.alumniconnect.dto.VerificationRequestDTO;
import com.alumniconnect.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/verification/pending")
    public ResponseEntity<List<VerificationRequestDTO>> getPendingVerifications() {
        return ResponseEntity.ok(adminService.getPendingVerifications());
    }

    @PostMapping("/verification/{userId}/approve")
    public ResponseEntity<VerificationRequestDTO> approveVerification(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(adminService.approveVerification(userId));
    }

    @PostMapping("/verification/{userId}/reject")
    public ResponseEntity<Map<String, String>> rejectVerification(@PathVariable("userId") Long userId) {
        adminService.rejectVerification(userId);
        return ResponseEntity.ok(Map.of("message", "Verification rejected and user removed"));
    }

    @PostMapping("/verification/{userId}/revoke")
    public ResponseEntity<Map<String, String>> revokeVerification(@PathVariable("userId") Long userId) {
        adminService.revokeVerification(userId);
        return ResponseEntity.ok(Map.of("message", "Verification revoked"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<VerificationRequestDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/verified")
    public ResponseEntity<List<VerificationRequestDTO>> getVerifiedUsers() {
        return ResponseEntity.ok(adminService.getVerifiedUsers());
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<VerificationRequestDTO>> getAlumni() {
        return ResponseEntity.ok(adminService.getAlumniUsers());
    }

    @GetMapping("/students")
    public ResponseEntity<List<VerificationRequestDTO>> getStudents() {
        return ResponseEntity.ok(adminService.getStudentUsers());
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("userId") Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
