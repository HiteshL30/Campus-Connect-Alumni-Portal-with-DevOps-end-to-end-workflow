package com.alumniconnect.repository;

import com.alumniconnect.entity.Chat;
import com.alumniconnect.entity.ChatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUser1IdOrderByUpdatedAtDesc(Long user1Id);

    List<Chat> findByUser2IdOrderByUpdatedAtDesc(Long user2Id);

    List<Chat> findByUser2IdAndStatus(Long user2Id, ChatStatus status);

    Optional<Chat> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    @Query("SELECT c FROM Chat c JOIN FETCH c.user1 JOIN FETCH c.user2 WHERE (c.user1.id = :userId OR c.user2.id = :userId) ORDER BY c.updatedAt DESC")
    List<Chat> findAllByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
