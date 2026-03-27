package com.alumniconnect.controller;

import com.alumniconnect.dto.AlumniProfileDTO;
import com.alumniconnect.service.AlumniService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@RequiredArgsConstructor
public class AlumniController {

    private final AlumniService alumniService;

    @GetMapping
    public ResponseEntity<List<AlumniProfileDTO>> getAllAlumni() {
        return ResponseEntity.ok(alumniService.getAllAlumni());
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<AlumniProfileDTO>> getAlumniByDepartment(@PathVariable("department") String department) {
        return ResponseEntity.ok(alumniService.getAlumniByDepartment(department));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AlumniProfileDTO> getAlumniById(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(alumniService.getAlumniById(userId));
    }

    @GetMapping("/mentors")
    public ResponseEntity<List<AlumniProfileDTO>> getAvailableMentors() {
        return ResponseEntity.ok(alumniService.getAvailableMentors());
    }

    @PutMapping("/profile")
    public ResponseEntity<AlumniProfileDTO> updateProfile(@RequestBody AlumniProfileDTO dto) {
        return ResponseEntity.ok(alumniService.updateProfile(dto));
    }
}
