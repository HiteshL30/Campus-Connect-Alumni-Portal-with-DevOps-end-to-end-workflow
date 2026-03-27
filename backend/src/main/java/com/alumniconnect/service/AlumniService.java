package com.alumniconnect.service;

import com.alumniconnect.dto.AlumniProfileDTO;
import com.alumniconnect.entity.AlumniProfile;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.AlumniProfileRepository;
import com.alumniconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumniService {

    private final AlumniProfileRepository alumniProfileRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public AlumniService(AlumniProfileRepository alumniProfileRepository, UserRepository userRepository, UserService userService) {
        this.alumniProfileRepository = alumniProfileRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public List<AlumniProfileDTO> getAllAlumni() {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // Not authenticated, return all alumni
        }

        List<User> alumniUsers;
        if (currentUser != null) {
            alumniUsers = userRepository.findByRoleAndIdNot(Role.ALUMNI, currentUser.getId());
        } else {
            alumniUsers = userRepository.findByRole(Role.ALUMNI);
        }

        return alumniUsers.stream()
                .map(user -> {
                    AlumniProfile profile = alumniProfileRepository.findByUserId(user.getId()).orElse(null);
                    return toDTO(user, profile);
                })
                .collect(Collectors.toList());
    }

    public List<AlumniProfileDTO> getAlumniByDepartment(String department) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // Not authenticated, return all alumni in department
        }

        List<User> alumniUsers;
        if (currentUser != null) {
            alumniUsers = userRepository.findByRoleAndDepartmentAndIdNot(Role.ALUMNI, department, currentUser.getId());
        } else {
            alumniUsers = userRepository.findByRoleAndDepartment(Role.ALUMNI, department);
        }

        return alumniUsers.stream()
                .map(user -> {
                    AlumniProfile profile = alumniProfileRepository.findByUserId(user.getId()).orElse(null);
                    return toDTO(user, profile);
                })
                .collect(Collectors.toList());
    }

    public AlumniProfileDTO getAlumniById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumni not found"));
        if (user.getRole() != Role.ALUMNI) {
            throw new ResourceNotFoundException("User is not an alumni");
        }
        AlumniProfile profile = alumniProfileRepository.findByUserId(userId).orElse(null);
        return toDTO(user, profile);
    }

    @Transactional
    public AlumniProfileDTO updateProfile(AlumniProfileDTO dto) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != Role.ALUMNI) {
            throw new UnauthorizedException("Only alumni can update alumni profile");
        }

        AlumniProfile profile = alumniProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    AlumniProfile newProfile = new AlumniProfile();
                    newProfile.setUser(currentUser);
                    return newProfile;
                });

        if (dto.getGraduationYear() != null)
            profile.setGraduationYear(dto.getGraduationYear());
        if (dto.getCurrentCompany() != null)
            profile.setCurrentCompany(dto.getCurrentCompany());
        if (dto.getCurrentPosition() != null)
            profile.setCurrentPosition(dto.getCurrentPosition());
        if (dto.getIndustry() != null)
            profile.setIndustry(dto.getIndustry());
        if (dto.getLocation() != null)
            profile.setLocation(dto.getLocation());
        if (dto.getBio() != null)
            profile.setBio(dto.getBio());
        if (dto.getSkills() != null)
            profile.setSkills(dto.getSkills());
        if (dto.getLinkedinUrl() != null)
            profile.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getAvailableForMentoring() != null)
            profile.setAvailableForMentoring(dto.getAvailableForMentoring());

        profile = alumniProfileRepository.save(profile);
        return toDTO(currentUser, profile);
    }

    public List<AlumniProfileDTO> getAvailableMentors() {
        return alumniProfileRepository.findAvailableForMentoring().stream()
                .map(profile -> toDTO(profile.getUser(), profile))
                .collect(Collectors.toList());
    }

    private AlumniProfileDTO toDTO(User user, AlumniProfile profile) {
        AlumniProfileDTO.AlumniProfileDTOBuilder builder = AlumniProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .department(user.getDepartment());

        if (profile != null) {
            builder.profileId(profile.getId())
                    .graduationYear(profile.getGraduationYear())
                    .currentCompany(profile.getCurrentCompany())
                    .currentPosition(profile.getCurrentPosition())
                    .industry(profile.getIndustry())
                    .location(profile.getLocation())
                    .bio(profile.getBio())
                    .skills(profile.getSkills())
                    .linkedinUrl(profile.getLinkedinUrl())
                    .availableForMentoring(profile.getAvailableForMentoring());
        }

        return builder.build();
    }
}
