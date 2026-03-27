package com.alumniconnect.repository;

import com.alumniconnect.entity.AlumniProfile;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniProfileRepository extends JpaRepository<AlumniProfile, Long> {
    Optional<AlumniProfile> findByUserId(Long userId);
    
    Optional<AlumniProfile> findByUser(User user);
    
    @Query("SELECT ap FROM AlumniProfile ap JOIN ap.user u WHERE u.department = :department")
    List<AlumniProfile> findByDepartment(String department);
    
    @Query("SELECT ap FROM AlumniProfile ap WHERE ap.availableForMentoring = true")
    List<AlumniProfile> findAvailableForMentoring();
}
