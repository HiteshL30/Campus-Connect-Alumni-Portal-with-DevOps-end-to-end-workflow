package com.alumniconnect.service;

import com.alumniconnect.dto.VerificationRequestDTO;
import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.User;
import com.alumniconnect.exception.BadRequestException;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<VerificationRequestDTO> getPendingVerifications() {
        return userRepository.findByVerifiedFalse()
                .stream()
                .filter(u -> u.getRole() != Role.ADMIN)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VerificationRequestDTO approveVerification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("User is already verified");
        }

        user.setVerified(true);
        user.setActive(true);
        return mapToDTO(userRepository.save(user));
    }

    @Transactional
    public void rejectVerification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Cannot reject a verified user");
        }

        userRepository.delete(user);
    }

    @Transactional
    public void revokeVerification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isVerified()) {
            throw new BadRequestException("User is not verified");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot revoke admin verification");
        }

        user.setVerified(false);
        userRepository.save(user);
    }

    public List<VerificationRequestDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<VerificationRequestDTO> getVerifiedUsers() {
        return userRepository.findByVerifiedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<VerificationRequestDTO> getAlumniUsers() {
        return userRepository.findByRole(Role.ALUMNI)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<VerificationRequestDTO> getStudentUsers() {
        return userRepository.findByRole(Role.STUDENT)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete an administrator account");
        }

        userRepository.delete(user);
    }

    private VerificationRequestDTO mapToDTO(User user) {
        return VerificationRequestDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .rollNumber(user.getRollNumber())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
