package com.alumniconnect.controller;

import com.alumniconnect.dto.NotificationDTO;
import com.alumniconnect.entity.Notification;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.NotificationRepository;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {
    
    @Autowired(required = false)
    private NotificationRepository notificationRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Notifications controller is working!");
    }

    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        User user = getUserSafely(userDetails);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationService.resolveMyNotifications(user, pageable));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<Map<String, Object>>> getUnreadNotifications(
            @AuthenticationPrincipal User currentUser) {
        
        System.out.println(">>> NotificationController.unread() CALLED <<<");
        log.info("Fetching unread notifications for user: {}", currentUser != null ? currentUser.getId() : "null");
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            List<Map<String, Object>> notifications = new ArrayList<>();
            
            // If notification repository exists, use it
            if (notificationRepository != null) {
                List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadFalse(currentUser.getId());
                for (Notification notif : unreadNotifications) {
                    Map<String, Object> n = new HashMap<>();
                    n.put("id", notif.getId());
                    n.put("message", notif.getMessage());
                    n.put("type", notif.getType());
                    n.put("read", notif.getIsRead());
                    n.put("createdAt", notif.getCreatedAt());
                    notifications.add(n);
                }
            }
            
            log.info("Returning {} notifications", notifications.size());
            return ResponseEntity.ok(notifications);
            
        } catch (Exception e) {
            log.error("Error fetching notifications", e);
            return ResponseEntity.ok(new ArrayList<>()); // Return empty list instead of error
        }
    }
    
    @GetMapping({"/unread-count", "/unread/count"})
    public ResponseEntity<Map<String, Integer>> getUnreadCount(
            @AuthenticationPrincipal User currentUser) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            int count = 0;
            if (notificationRepository != null) {
                count = notificationRepository.countByRecipientIdAndIsReadFalse(currentUser.getId());
            }
            return ResponseEntity.ok(Map.of("count", count));
            
        } catch (Exception e) {
            log.error("Error counting notifications", e);
            return ResponseEntity.ok(Map.of("count", 0));
        }
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        User user = getUserSafely(userDetails);
        if (user == null) return ResponseEntity.status(401).build();
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUserSafely(userDetails);
        if (user == null) return ResponseEntity.status(401).build();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    private User getUserSafely(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }
}
