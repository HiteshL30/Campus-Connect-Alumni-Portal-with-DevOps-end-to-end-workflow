package com.alumniconnect.service;

import com.alumniconnect.dto.JobCreateRequest;
import com.alumniconnect.dto.JobDTO;
import com.alumniconnect.dto.RecommendedJobDTO;
import com.alumniconnect.entity.Job;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.StudentProfile;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.JobRepository;
import com.alumniconnect.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserService userService;
    private final StudentProfileRepository studentProfileRepository;

    private static final Map<String, String> SKILL_ALIASES = Map.of(
            "js", "javascript",
            "reactjs", "react",
            "react.js", "react",
            "nodejs", "node",
            "spring boot", "spring");

    public List<JobDTO> getAllActiveJobs() {
        return jobRepository.findActiveNonExpiredJobs(LocalDateTime.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<JobDTO> getAllActiveJobs(String jobType, String search, Pageable pageable) {
        return jobRepository.findActiveJobsByFilters(LocalDateTime.now(), jobType, search, pageable)
                .map(this::toDTO);
    }

    public List<JobDTO> getJobsByDepartment(String department) {
        return jobRepository.findJobsByDepartment(java.time.LocalDateTime.now(), department).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return toDTO(job);
    }

    public List<JobDTO> getMyJobs() {
        User currentUser = userService.getCurrentUser();
        return jobRepository.findByPostedByIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RecommendedJobDTO> getRecommendationsForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.STUDENT) {
            return Collections.emptyList();
        }

        StudentProfile studentProfile = studentProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Set<String> studentSkills = normalizeSkills(studentProfile.getSkills());
        if (studentSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<Job> activeJobs = jobRepository.findActiveNonExpiredJobs(LocalDateTime.now());

        return activeJobs.stream()
                .filter(job -> job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty())
                .map(job -> {
                    Set<String> jobSkills = normalizeSkills(String.join(",", job.getRequiredSkills()));
                    Set<String> matchingSkills = studentSkills.stream()
                            .filter(jobSkills::contains)
                            .collect(Collectors.toSet());

                    double matchScore = jobSkills.isEmpty() ? 0.0
                            : ((double) matchingSkills.size() / jobSkills.size()) * 100;

                    return RecommendedJobDTO.builder()
                            .id(job.getId())
                            .title(job.getTitle())
                            .company(job.getCompany())
                            .location(job.getLocation())
                            .jobType(job.getJobType())
                            .matchScore(matchScore)
                            .matchingSkills(matchingSkills)
                            .build();
                })
                .filter(dto -> dto.getMatchScore() > 30.0)
                .sorted(Comparator.comparing(RecommendedJobDTO::getMatchScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    private Set<String> normalizeSkills(String skills) {
        if (skills == null || skills.isBlank())
            return Collections.emptySet();

        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .map(s -> SKILL_ALIASES.getOrDefault(s, s))
                .collect(Collectors.toSet());
    }

    @Transactional
    public JobDTO createJob(JobCreateRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != Role.ALUMNI && currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only alumni and admin can create jobs");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .description(request.getDescription())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .salary(request.getSalary())
                .requirements(request.getRequirements())
                .applicationUrl(request.getApplicationUrl())
                .expiryDate(request.getExpiryDate())
                .allowedBatch(request.getAllowedBatch())
                .allowedDepartment(request.getAllowedDepartment())
                .requiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new HashSet<>())
                .salary(request.getSalary())
                .workplace(request.getWorkplace())
                .postedBy(currentUser)
                .isActive(true)
                .build();

        job = jobRepository.save(job);
        return toDTO(job);
    }

    @Transactional
    public JobDTO updateJob(Long id, JobCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getPostedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own jobs");
        }

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setSalary(request.getSalary());
        job.setRequirements(request.getRequirements());
        job.setApplicationUrl(request.getApplicationUrl());
        job.setExpiryDate(request.getExpiryDate());
        job.setAllowedBatch(request.getAllowedBatch());
        job.setAllowedDepartment(request.getAllowedDepartment());
        job.setSalary(request.getSalary());
        job.setWorkplace(request.getWorkplace());
        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(request.getRequiredSkills());
        }

        job = jobRepository.save(job);
        return toDTO(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        User currentUser = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getPostedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own jobs");
        }

        job.setIsActive(false);
        jobRepository.save(job);
    }

    private JobDTO toDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .description(job.getDescription())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .requirements(job.getRequirements())
                .applicationUrl(job.getApplicationUrl())
                .postedById(job.getPostedBy().getId())
                .postedByName(job.getPostedBy().getFirstName() + " " + job.getPostedBy().getLastName())
                .isActive(job.getIsActive())
                .createdAt(job.getCreatedAt())
                .expiryDate(job.getExpiryDate())
                .allowedBatch(job.getAllowedBatch())
                .allowedDepartment(job.getAllowedDepartment())
                .requiredSkills(job.getRequiredSkills())
                .salary(job.getSalary())
                .workplace(job.getWorkplace())
                .build();
    }
}
