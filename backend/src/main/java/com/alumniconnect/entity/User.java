package com.alumniconnect.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String rollNumber;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private Role role;

    private String department;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isLocked = false;

    @Column(nullable = false)
    private boolean verified = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StudentProfile studentProfile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AlumniProfile alumniProfile;

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventParticipant> joinedEvents = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user1", cascade = CascadeType.REMOVE)
    private List<Chat> chatsAsUser1 = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "user2", cascade = CascadeType.REMOVE)
    private List<Chat> chatsAsUser2 = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.REMOVE)
    private List<Connection> sentConnections = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.REMOVE)
    private List<Connection> receivedConnections = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.REMOVE)
    private List<Job> postedJobs = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<Event> createdEvents = new java.util.ArrayList<>();

    public User() {
    }

    public User(Long id, String email, String password, String firstName, String lastName, Role role,
            boolean verified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.verified = verified;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (rollNumber != null && rollNumber.trim().isEmpty()) {
            rollNumber = null;
        }
        if (department != null && department.trim().isEmpty()) {
            department = null;
        }

        if (this.role == Role.ADMIN) {
            this.verified = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public AlumniProfile getAlumniProfile() {
        return alumniProfile;
    }

    public void setAlumniProfile(AlumniProfile alumniProfile) {
        this.alumniProfile = alumniProfile;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<EventParticipant> getJoinedEvents() {
        return joinedEvents;
    }

    public void setJoinedEvents(List<EventParticipant> joinedEvents) {
        this.joinedEvents = joinedEvents;
    }

    // Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String rollNumber;
        private Role role;
        private String department;
        private boolean isActive = true;
        private boolean isLocked = false;
        private boolean verified;

        public UserBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserBuilder rollNumber(String rollNumber) {
            this.rollNumber = rollNumber;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuilder department(String department) {
            this.department = department;
            return this;
        }

        public UserBuilder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public UserBuilder isLocked(boolean isLocked) {
            this.isLocked = isLocked;
            return this;
        }

        public UserBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public User build() {
            User user = new User(id, email, password, firstName, lastName, role, verified);
            user.setRollNumber(this.rollNumber);
            user.setDepartment(this.department);
            user.setActive(this.isActive);
            user.setLocked(this.isLocked);
            return user;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
