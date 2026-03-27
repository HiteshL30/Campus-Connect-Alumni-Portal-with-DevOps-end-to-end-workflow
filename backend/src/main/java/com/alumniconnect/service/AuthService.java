package com.alumniconnect.service;

import com.alumniconnect.dto.AuthRequest;
import com.alumniconnect.dto.AuthResponse;
import com.alumniconnect.dto.SignupRequest;
import com.alumniconnect.entity.*;
import com.alumniconnect.repository.AlumniProfileRepository;
import com.alumniconnect.repository.StudentProfileRepository;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.security.JwtService;
import com.alumniconnect.exception.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final UserRepository userRepository;
        private final StudentProfileRepository studentProfileRepository;
        private final AlumniProfileRepository alumniProfileRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public AuthResponse signup(SignupRequest request) {
                log.info("Processing signup request for email: {}", request.getEmail());
                if (userRepository.existsByEmail(request.getEmail())) {
                        log.warn("Signup failed: Email {} already exists", request.getEmail());
                        throw new UserAlreadyExistsException("Email already exists");
                }

                // Convert empty strings to null for optional fields
                String rollNumber = request.getRollNumber();
                if (rollNumber != null && rollNumber.trim().isEmpty()) {
                        rollNumber = null;
                }

                String department = request.getDepartment();
                if (department != null && department.trim().isEmpty()) {
                        department = null;
                }

                boolean isAdminRole = request.getRole() == Role.ADMIN;

                User user = User.builder()
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .rollNumber(rollNumber)
                                .role(request.getRole())
                                .department(department)
                                .isActive(true)
                                .isLocked(false)
                                .verified(isAdminRole)
                                .build();

                user = userRepository.save(user);

                if (request.getRole() == Role.STUDENT) {
                        StudentProfile profile = StudentProfile.builder()
                                        .user(user)
                                        .build();
                        studentProfileRepository.save(profile);
                } else if (request.getRole() == Role.ALUMNI) {
                        AlumniProfile profile = AlumniProfile.builder()
                                        .user(user)
                                        .availableForMentoring(false)
                                        .build();
                        alumniProfileRepository.save(profile);
                }

                String token = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .token(token)
                                .userId(user.getId())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .rollNumber(user.getRollNumber())
                                .role(user.getRole())
                                .department(user.getDepartment())
                                .verified(user.isVerified())
                                .build();
        }

        public AuthResponse login(AuthRequest request) {
                log.info("Processing login request for email: {}", request.getEmail());
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getEmail(),
                                                        request.getPassword()));
                } catch (DisabledException ex) {
                        log.error("Login failed: Account disabled for email {}", request.getEmail());
                        throw new DisabledException("Account is disabled. Please contact administrator.");
                } catch (LockedException ex) {
                        log.error("Login failed: Account locked for email {}", request.getEmail());
                        throw new LockedException("Account is locked. Please contact administrator.");
                } catch (BadCredentialsException ex) {
                        log.warn("Login failed: Invalid credentials for email {}", request.getEmail());
                        throw new BadCredentialsException("Invalid email or password");
                }

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

                String token = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .token(token)
                                .userId(user.getId())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .rollNumber(user.getRollNumber())
                                .role(user.getRole())
                                .department(user.getDepartment())
                                .verified(user.isVerified())
                                .build();
        }
}
