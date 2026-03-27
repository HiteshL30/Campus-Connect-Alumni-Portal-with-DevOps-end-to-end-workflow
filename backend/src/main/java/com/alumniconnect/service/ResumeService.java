package com.alumniconnect.service;

import com.alumniconnect.dto.ResumeDTO;
import com.alumniconnect.entity.*;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.exception.UnauthorizedException;
import com.alumniconnect.repository.AlumniProfileRepository;
import com.alumniconnect.repository.StudentProfileRepository;
import com.alumniconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final UserRepository userRepository;
    private final AlumniProfileRepository alumniProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ConnectionService connectionService;
    private final StorageService storageService;

    @org.springframework.transaction.annotation.Transactional
    public String uploadResume(User user, org.springframework.web.multipart.MultipartFile file) {
        String filename = storageService.store(file);
        String fileUrl = "/api/resume/resource/" + filename;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUser(user)
                    .orElse(StudentProfile.builder().user(user).build());
            profile.setResumeUrl(fileUrl);
            studentProfileRepository.save(profile);
        } else if (user.getRole() == Role.ALUMNI) {
            AlumniProfile profile = alumniProfileRepository.findByUser(user)
                    .orElse(AlumniProfile.builder().user(user).build());
            profile.setResumeUrl(fileUrl);
            alumniProfileRepository.save(profile);
        } else {
            throw new UnauthorizedException("Only students and alumni can upload resumes");
        }
        return fileUrl;
    }

    public org.springframework.core.io.Resource loadResumeResource(String filename) {
        return storageService.loadAsResource(filename);
    }

    public ResumeDTO getResume(User currentUser, Long targetUserId) {
        if (!currentUser.isVerified()) {
            throw new UnauthorizedException("Only verified users can view resumes");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!targetUser.isVerified()) {
            throw new UnauthorizedException("Cannot view resume of unverified user");
        }

        if (connectionService.isUserBlocked(currentUser, targetUser)) {
            throw new UnauthorizedException("Access denied - user is blocked");
        }

        boolean isSelf = currentUser.getId().equals(targetUserId);
        boolean isConnected = connectionService.areUsersConnected(currentUser, targetUser);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isSelf && !isConnected && !isAdmin) {
            throw new UnauthorizedException("You must be connected to view this resume");
        }

        String resumeUrl = null;
        if (targetUser.getRole() == Role.ALUMNI) {
            AlumniProfile profile = alumniProfileRepository.findByUser(targetUser)
                    .orElse(null);
            if (profile != null) {
                resumeUrl = profile.getResumeUrl();
            }
        } else if (targetUser.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUser(targetUser)
                    .orElse(null);
            if (profile != null) {
                resumeUrl = profile.getResumeUrl();
            }
        }

        return ResumeDTO.builder()
                .userId(targetUser.getId())
                .userName(targetUser.getFirstName() + " " + targetUser.getLastName())
                .role(targetUser.getRole().name())
                .department(targetUser.getDepartment())
                .resumeUrl(resumeUrl)
                .hasAccess(true)
                .build();
    }

    public boolean canViewResume(User currentUser, Long targetUserId) {
        if (!currentUser.isVerified()) {
            return false;
        }

        User targetUser = userRepository.findById(targetUserId).orElse(null);
        if (targetUser == null || !targetUser.isVerified()) {
            return false;
        }

        if (connectionService.isUserBlocked(currentUser, targetUser)) {
            return false;
        }

        boolean isSelf = currentUser.getId().equals(targetUserId);
        boolean isConnected = connectionService.areUsersConnected(currentUser, targetUser);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        return isSelf || isConnected || isAdmin;
    }
}
