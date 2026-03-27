package com.alumniconnect.repository;

import com.alumniconnect.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);

    Message findFirstByChatIdOrderByCreatedAtDesc(Long chatId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(m) FROM Message m JOIN m.chat c WHERE (c.user1 = :user OR c.user2 = :user) AND m.sender <> :user AND m.isRead = false")
    long countUnreadMessagesForUser(
            @org.springframework.data.repository.query.Param("user") com.alumniconnect.entity.User user);
}
