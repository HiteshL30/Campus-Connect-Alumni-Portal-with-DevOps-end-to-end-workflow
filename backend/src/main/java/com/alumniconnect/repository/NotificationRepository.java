package com.alumniconnect.repository;

import com.alumniconnect.entity.Notification;
import com.alumniconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch all notifications for a user, ordered by latest first
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);

    // Fetch unread notifications count
    long countByRecipientAndIsReadFalse(User recipient);

    // Mark all as read feature support
    List<Notification> findByRecipientAndIsReadFalse(User recipient);
}
