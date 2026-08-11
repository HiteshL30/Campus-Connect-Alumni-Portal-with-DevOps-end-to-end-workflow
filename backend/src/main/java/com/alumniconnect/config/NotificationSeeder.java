package com.alumniconnect.config;

import com.alumniconnect.entity.NotificationType;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationSeeder {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(NotificationSeeder.class);

    @PostConstruct
    public void createSampleNotifications() {
        try {
            long count = userRepository.count();
            if (count > 0) {
                // Get the first few users to seed them notifications
                List<User> users = userRepository.findAll().stream().limit(3).toList();
                
                for (User user : users) {
                    if (notificationService.getUnreadCount(user) == 0) {
                        notificationService.createNotification(
                                user, 
                                NotificationType.CONNECTION_REQUEST, 
                                "You have a new connection request!", 
                                null
                        );
                        notificationService.createNotification(
                                user, 
                                NotificationType.JOB_POSTED, 
                                "New job matching your skills has been posted.", 
                                null
                        );
                        logger.info("Sample notifications created for user: {}", user.getEmail());
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Failed to create sample notifications: {}", e.getMessage());
        }
    }
}
