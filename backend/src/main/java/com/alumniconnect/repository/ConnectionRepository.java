package com.alumniconnect.repository;

import com.alumniconnect.entity.Connection;
import com.alumniconnect.entity.ConnectionStatus;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

       @Query("SELECT c FROM Connection c WHERE " +
                     "(c.requester = :user1 AND c.receiver = :user2) OR " +
                     "(c.requester = :user2 AND c.receiver = :user1)")
       Optional<Connection> findConnectionBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

       @Query("SELECT c FROM Connection c WHERE " +
                     "(c.requester = :user OR c.receiver = :user) AND c.status = :status")
       List<Connection> findAllByUserAndStatus(@Param("user") User user, @Param("status") ConnectionStatus status);

       @Query("SELECT c FROM Connection c WHERE c.receiver = :user AND c.status = 'REQUESTED'")
       List<Connection> findPendingRequestsForUser(@Param("user") User user);

       @Query("SELECT c FROM Connection c WHERE c.requester = :user AND c.status = 'REQUESTED'")
       List<Connection> findSentRequestsByUser(@Param("user") User user);

       @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c WHERE " +
                     "((c.requester = :user1 AND c.receiver = :user2) OR (c.requester = :user2 AND c.receiver = :user1)) "
                     +
                     "AND c.status = 'ACCEPTED'")
       boolean areUsersConnected(@Param("user1") User user1, @Param("user2") User user2);

       @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c WHERE " +
                     "((c.requester = :user1 AND c.receiver = :user2) OR (c.requester = :user2 AND c.receiver = :user1)) "
                     +
                     "AND c.status = 'BLOCKED'")
       boolean isUserBlocked(@Param("user1") User user1, @Param("user2") User user2);

       @Query("SELECT COUNT(c) FROM Connection c WHERE c.receiver = :user AND c.status = 'REQUESTED'")
       long countPendingRequestsForUser(@Param("user") User user);

       @Query("SELECT COUNT(c) FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = 'ACCEPTED'")
       long countConnectionsForUser(@Param("user") User user);
       
       @Query(value = "SELECT COUNT(*) FROM connections WHERE (requester_id = :userId OR receiver_id = :userId) AND status = 'ACCEPTED'", nativeQuery = true)
       int countAcceptedConnectionsNative(@Param("userId") Long userId);
    
       @Query(value = "SELECT COUNT(*) FROM connections WHERE receiver_id = :userId AND status = 'REQUESTED'", nativeQuery = true)
       int countPendingRequestsNative(@Param("userId") Long userId);
}
