package com.alumniconnect.service;

import com.alumniconnect.dto.UserDTO;
import com.alumniconnect.dto.UserProfileDTO;
import com.alumniconnect.dto.UserStatsDTO;
import com.alumniconnect.entity.*;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MessageRepository messageRepository;
    private final ConnectionRepository connectionRepository;

    public UserService(UserRepository userRepository,
            AlumniProfileRepository alumniProfileRepository,
            StudentProfileRepository studentProfileRepository,
            MessageRepository messageRepository,
            ConnectionRepository connectionRepository) {
        this.userRepository = userRepository;
        this.alumniProfileRepository = alumniProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.messageRepository = messageRepository;
        this.connectionRepository = connectionRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfileById(Long id) {
        try {
            log.info("Starting profile fetch for user ID: {}", id);
            User user = getUserById(id);

            UserProfileDTO.UserProfileDTOBuilder builder = UserProfileDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .rollNumber(user.getRollNumber())
                    .role(user.getRole())
                    .department(user.getDepartment())
                    .verified(user.isVerified());

            if (user.getRole() == Role.STUDENT) {
                studentProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    builder.bio(p.getBio())
                            .skills(p.getSkills())
                            .linkedinUrl(p.getLinkedinUrl())
                            .graduationYear(p.getGraduationYear())
                            .interests(p.getInterests())
                            .resumeUrl(p.getResumeUrl())
                            .studentId(p.getStudentId())
                            .major(p.getMajor());
                });
            } else if (user.getRole() == Role.ALUMNI) {
                alumniProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    builder.bio(p.getBio())
                            .skills(p.getSkills())
                            .linkedinUrl(p.getLinkedinUrl())
                            .graduationYear(p.getGraduationYear())
                            .currentCompany(p.getCurrentCompany())
                            .currentPosition(p.getCurrentPosition())
                            .industry(p.getIndustry())
                            .location(p.getLocation())
                            .availableForMentoring(p.getAvailableForMentoring());
                });
            }
            return builder.build();
        } catch (Exception e) {
            log.error("Error in getUserProfileById: {}", e.getMessage());
            throw e;
        }
    }

    public UserDTO getCurrentUserDTO() {
        return toDTO(getCurrentUser());
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getCurrentUserProfile() {
        try {
            log.info("Starting profile fetch for authenticated user");
            User user = getCurrentUser();
            if (user == null) {
                log.error("getCurrentUser() returned null");
                throw new ResourceNotFoundException("User not found after re-fetch");
            }
            log.info("User re-fetched successfully: ID={}, Email={}, Role={}", user.getId(), user.getEmail(),
                    user.getRole());

            UserProfileDTO.UserProfileDTOBuilder builder = UserProfileDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .rollNumber(user.getRollNumber())
                    .role(user.getRole())
                    .department(user.getDepartment())
                    .verified(user.isVerified());

            if (user.getRole() == Role.STUDENT) {
                log.info("Processing STUDENT specific data for ID: {}", user.getId());
                studentProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    log.info("StudentProfile found for ID: {}", user.getId());
                    builder.bio(p.getBio())
                            .skills(p.getSkills())
                            .linkedinUrl(p.getLinkedinUrl())
                            .graduationYear(p.getGraduationYear())
                            .interests(p.getInterests())
                            .resumeUrl(p.getResumeUrl())
                            .studentId(p.getStudentId())
                            .major(p.getMajor());
                });
            } else if (user.getRole() == Role.ALUMNI) {
                log.info("Processing ALUMNI specific data for ID: {}", user.getId());
                alumniProfileRepository.findByUserId(user.getId()).ifPresent(p -> {
                    log.info("AlumniProfile found for ID: {}", user.getId());
                    builder.bio(p.getBio())
                            .skills(p.getSkills())
                            .linkedinUrl(p.getLinkedinUrl())
                            .graduationYear(p.getGraduationYear())
                            .currentCompany(p.getCurrentCompany())
                            .currentPosition(p.getCurrentPosition())
                            .industry(p.getIndustry())
                            .location(p.getLocation())
                            .availableForMentoring(p.getAvailableForMentoring());
                });
            }
            log.info("Profile builder completed, building DTO");
            return builder.build();
        } catch (Exception e) {
            log.error("CRITICAL ERROR in getCurrentUserProfile: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public UserProfileDTO updateCurrentUserProfile(UserProfileDTO dto) {
        User user = getCurrentUser();

        // Update core User fields (only some are allowed)
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setRollNumber(dto.getRollNumber());
        user.setDepartment(dto.getDepartment());
        // Email, Role, and Verified status are NOT updatable here for security

        userRepository.save(user);

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUser(user)
                    .orElseGet(() -> StudentProfile.builder().user(user).build());

            profile.setBio(dto.getBio());
            profile.setSkills(dto.getSkills());
            profile.setLinkedinUrl(dto.getLinkedinUrl());
            profile.setGraduationYear(dto.getGraduationYear());
            profile.setInterests(dto.getInterests());
            profile.setStudentId(dto.getStudentId());
            profile.setMajor(dto.getMajor());

            studentProfileRepository.save(profile);
        } else if (user.getRole() == Role.ALUMNI) {
            AlumniProfile profile = alumniProfileRepository.findByUser(user)
                    .orElseGet(() -> AlumniProfile.builder().user(user).build());

            profile.setBio(dto.getBio());
            profile.setSkills(dto.getSkills());
            profile.setLinkedinUrl(dto.getLinkedinUrl());
            profile.setGraduationYear(dto.getGraduationYear());
            profile.setCurrentCompany(dto.getCurrentCompany());
            profile.setCurrentPosition(dto.getCurrentPosition());
            profile.setIndustry(dto.getIndustry());
            profile.setLocation(dto.getLocation());
            profile.setAvailableForMentoring(dto.getAvailableForMentoring());

            alumniProfileRepository.save(profile);
        }

        return getCurrentUserProfile();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public void verifyUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isVerified()) {
            user.setVerified(true);
            userRepository.save(user);
            log.info("User with id {} verified", id);
        } else {
            log.warn("User with id {} is already verified", id);
        }
    }

    public List<UserDTO> getUnverifiedByDepartment(String department) {
        if (department == null || department.trim().isEmpty()) {
            throw new IllegalArgumentException("Department cannot be null or empty");
        }
        return userRepository.findByRoleAndDepartmentAndVerifiedFalse(Role.ALUMNI, department)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .rollNumber(user.getRollNumber())
                .role(user.getRole())
                .department(user.getDepartment())
                .verified(user.isVerified())
                .build();
    }

    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats() {
        User currentUser = getCurrentUser();
        long unreadMessages = messageRepository.countUnreadMessagesForUser(currentUser);
        long pendingConnections = connectionRepository.countPendingRequestsForUser(currentUser);
        return new UserStatsDTO(unreadMessages, pendingConnections);
    }
}
