package com.alumniconnect.repository;

import com.alumniconnect.entity.Event;
import com.alumniconnect.entity.EventParticipant;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    boolean existsByEventAndUser(Event event, User user);

    Optional<EventParticipant> findByEventAndUser(Event event, User user);

    long countByEvent(Event event);
}
