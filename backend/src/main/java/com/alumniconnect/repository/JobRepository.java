package com.alumniconnect.repository;

import com.alumniconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrueOrderByCreatedAtDesc();

    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long userId);

    @Modifying
    @Query("UPDATE Job j SET j.isActive = false WHERE j.isActive = true AND j.expiryDate IS NOT NULL AND j.expiryDate < :now")
    int expireOldJobs(@Param("now") LocalDateTime now);

    @Query("SELECT j FROM Job j WHERE j.isActive = true AND (j.expiryDate IS NULL OR j.expiryDate > :now) ORDER BY j.createdAt DESC")
    List<Job> findActiveNonExpiredJobs(@Param("now") LocalDateTime now);

    @Query("SELECT j FROM Job j WHERE j.isActive = true AND (j.expiryDate IS NULL OR j.expiryDate > :now) " +
            "AND (j.allowedDepartment IS NULL OR j.allowedDepartment = '' OR j.allowedDepartment = :department) " +
            "ORDER BY j.createdAt DESC")
    List<Job> findJobsByDepartment(@Param("now") LocalDateTime now, @Param("department") String department);

    @Query("SELECT j FROM Job j WHERE j.isActive = true AND (j.expiryDate IS NULL OR j.expiryDate > :now) " +
            "AND (:jobType IS NULL OR j.jobType = :jobType) " +
            "AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY j.createdAt DESC")
    org.springframework.data.domain.Page<Job> findActiveJobsByFilters(
            @Param("now") LocalDateTime now,
            @Param("jobType") String jobType,
            @Param("search") String search,
            org.springframework.data.domain.Pageable pageable);
}
