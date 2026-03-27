package com.alumniconnect.repository;

import com.alumniconnect.entity.StudentProfile;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    
    Optional<StudentProfile> findByUser(User user);
}
