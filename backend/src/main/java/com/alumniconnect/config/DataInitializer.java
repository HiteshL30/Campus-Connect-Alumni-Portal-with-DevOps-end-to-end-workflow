package com.alumniconnect.config;

import com.alumniconnect.entity.*;
import com.alumniconnect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EventRepository eventRepository;
    private final ConnectionRepository connectionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User admin = ensureAdminCreated();
        ensureSampleDataCreated(admin);
    }

    private User ensureAdminCreated() {
        if (!userRepository.existsByEmail("admin@connect.com")) {
            log.info("Bootstrapping Super Admin account...");
            User admin = User.builder()
                    .email("admin@connect.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Super")
                    .lastName("Admin")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .isLocked(false)
                    .verified(true)
                    .build();
            admin = userRepository.save(admin);
            log.info("Super Admin account created successfully!");
            return admin;
        }
        return userRepository.findByEmail("admin@connect.com").orElse(null);
    }

    private void ensureSampleDataCreated(User admin) {
        if (jobRepository.count() == 0) {
            log.info("Creating sample jobs...");
            jobRepository.save(Job.builder()
                    .title("Software Engineer Intern")
                    .company("Tech Corp")
                    .description("Exciting internship opportunity in Java development.")
                    .location("Remote")
                    .jobType("INTERNSHIP")
                    .salary("50k - 70k")
                    .postedBy(admin)
                    .isActive(true)
                    .requiredSkills(Set.of("Java", "Spring Boot"))
                    .build());

            jobRepository.save(Job.builder()
                    .title("Frontend Developer")
                    .company("UI Masters")
                    .description("Looking for a React specialist to join our dynamic team.")
                    .location("New York")
                    .jobType("FULL_TIME")
                    .salary("100k - 120k")
                    .postedBy(admin)
                    .isActive(true)
                    .requiredSkills(Set.of("React", "TailwindCSS"))
                    .build());
            log.info("Sample jobs created.");
        }

        if (eventRepository.count() == 0) {
            log.info("Creating sample events...");
            eventRepository.save(Event.builder()
                    .title("Alumni Meetup 2026")
                    .description("Annual meetup for all graduated batches.")
                    .eventDate(LocalDateTime.now().plusDays(30))
                    .location("Campus Auditorium")
                    .eventType("NETWORKING")
                    .maxAttendees(200)
                    .createdBy(admin)
                    .isActive(true)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Career Workshop")
                    .description("How to crack top tech companies.")
                    .eventDate(LocalDateTime.now().plusDays(7))
                    .location("Online")
                    .eventType("WORKSHOP")
                    .maxAttendees(500)
                    .createdBy(admin)
                    .isActive(true)
                    .build());
            log.info("Sample events created.");
        }

        ensureSampleConnection(admin);
    }

    private void ensureSampleConnection(User admin) {
        if (!userRepository.existsByEmail("alumni@connect.com")) {
            log.info("Creating sample alumni for connection...");
            User alumni = User.builder()
                    .email("alumni@connect.com")
                    .password(passwordEncoder.encode("alumni123"))
                    .firstName("John")
                    .lastName("Doe")
                    .role(Role.ALUMNI)
                    .isActive(true)
                    .verified(true)
                    .build();
            alumni = userRepository.save(alumni);

            log.info("Creating sample connection...");
            connectionRepository.save(Connection.builder()
                    .requester(admin)
                    .receiver(alumni)
                    .status(ConnectionStatus.ACCEPTED)
                    .build());
            log.info("Sample connection created.");
        }
    }
}
