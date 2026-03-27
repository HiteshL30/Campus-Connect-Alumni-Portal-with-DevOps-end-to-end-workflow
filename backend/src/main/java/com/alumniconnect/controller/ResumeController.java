package com.alumniconnect.controller;

import com.alumniconnect.dto.ResumeDTO;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<ResumeDTO> getResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("userId") Long userId) {
        User currentUser = getUserFromDetails(userDetails);
        return ResponseEntity.ok(resumeService.getResume(currentUser, userId));
    }

    @GetMapping("/{userId}/access")
    public ResponseEntity<Map<String, Boolean>> checkResumeAccess(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("userId") Long userId) {
        User currentUser = getUserFromDetails(userDetails);
        boolean canView = resumeService.canViewResume(currentUser, userId);
        return ResponseEntity.ok(Map.of("canView", canView));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        User currentUser = getUserFromDetails(userDetails);
        String fileUrl = resumeService.uploadResume(currentUser, file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    @GetMapping("/resource/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> serveFile(@PathVariable("filename") String filename) {
        // In a real app, you might want check access here too if resumes are private
        // For now, relying on the unguessable UUID filename
        org.springframework.core.io.Resource file = resumeService.loadResumeResource(filename);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    private User getUserFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
