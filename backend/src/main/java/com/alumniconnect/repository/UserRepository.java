package com.alumniconnect.repository;

import com.alumniconnect.entity.Role;
import com.alumniconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndDepartment(Role role, String department);

    List<User> findByRoleAndDepartmentAndVerifiedFalse(Role role, String department);

    List<User> findByVerifiedFalse();

    List<User> findByVerifiedTrue();

    List<User> findByRoleAndVerifiedTrue(Role role);

    List<User> findByRoleAndIdNot(Role role, Long id);

    List<User> findByRoleAndDepartmentAndIdNot(Role role, String department, Long id);
}