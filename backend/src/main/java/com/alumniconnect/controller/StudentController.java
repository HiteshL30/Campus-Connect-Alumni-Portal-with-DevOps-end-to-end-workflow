package com.alumniconnect.controller;

import com.alumniconnect.dto.StudentProfileDTO;
import com.alumniconnect.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentProfileDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<StudentProfileDTO> getStudentById(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(studentService.getStudentById(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDTO> updateProfile(@RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(studentService.updateProfile(dto));
    }
}
