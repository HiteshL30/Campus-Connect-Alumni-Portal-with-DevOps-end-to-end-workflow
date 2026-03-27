package com.alumniconnect.service;

import com.alumniconnect.dto.StudentProfileDTO;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.StudentProfile;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.StudentProfileRepository;
import com.alumniconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public List<StudentProfileDTO> getAllStudents() {
        List<User> studentUsers = userRepository.findByRole(Role.STUDENT);
        return studentUsers.stream()
                .map(user -> {
                    StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);
                    return toDTO(user, profile);
                })
                .collect(Collectors.toList());
    }

    public StudentProfileDTO getStudentById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (user.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("User is not a student");
        }
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        return toDTO(user, profile);
    }

    @Transactional
    public StudentProfileDTO updateProfile(StudentProfileDTO dto) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.STUDENT) {
            throw new UnauthorizedException("Only students can update student profile");
        }

        StudentProfile profile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(currentUser);
                    return newProfile;
                });

        if (dto.getStudentId() != null) profile.setStudentId(dto.getStudentId());
        if (dto.getMajor() != null) profile.setMajor(dto.getMajor());
        if (dto.getGraduationYear() != null) profile.setGraduationYear(dto.getGraduationYear());
        if (dto.getBio() != null) profile.setBio(dto.getBio());
        if (dto.getSkills() != null) profile.setSkills(dto.getSkills());
        if (dto.getInterests() != null) profile.setInterests(dto.getInterests());
        if (dto.getLinkedinUrl() != null) profile.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getResumeUrl() != null) profile.setResumeUrl(dto.getResumeUrl());

        profile = studentProfileRepository.save(profile);
        return toDTO(currentUser, profile);
    }

    private StudentProfileDTO toDTO(User user, StudentProfile profile) {
        StudentProfileDTO.StudentProfileDTOBuilder builder = StudentProfileDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .department(user.getDepartment());

        if (profile != null) {
            builder.id(profile.getId())
                    .studentId(profile.getStudentId())
                    .major(profile.getMajor())
                    .graduationYear(profile.getGraduationYear())
                    .bio(profile.getBio())
                    .skills(profile.getSkills())
                    .interests(profile.getInterests())
                    .linkedinUrl(profile.getLinkedinUrl())
                    .resumeUrl(profile.getResumeUrl());
        }

        return builder.build();
    }
}
