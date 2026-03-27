package com.alumniconnect.controller;

import com.alumniconnect.dto.JobCreateRequest;
import com.alumniconnect.dto.JobDTO;
import com.alumniconnect.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<?> getAllJobs(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        
        // If frontend sends "All", treat it as null for filtering
        String filterType = "All".equals(type) ? null : type;
        
        return ResponseEntity.ok(jobService.getAllActiveJobs(filterType, search, pageable));
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<JobDTO>> getJobsByDepartment(@PathVariable("department") String department) {
        return ResponseEntity.ok(jobService.getJobsByDepartment(department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ALUMNI', 'ADMIN')")
    public ResponseEntity<List<JobDTO>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ALUMNI', 'ADMIN')")
    public ResponseEntity<JobDTO> createJob(@Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.ok(jobService.createJob(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ALUMNI', 'ADMIN')")
    public ResponseEntity<JobDTO> updateJob(@PathVariable("id") Long id, @Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ALUMNI', 'ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recommended")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<com.alumniconnect.dto.RecommendedJobDTO>> getRecommendedJobs() {
        return ResponseEntity.ok(jobService.getRecommendationsForCurrentUser());
    }
}
