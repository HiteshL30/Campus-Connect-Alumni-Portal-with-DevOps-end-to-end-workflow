package com.alumniconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String studentId;
    private String major;
    private Integer graduationYear;
    private String bio;
    private String skills;
    private String interests;
    private String linkedinUrl;
    private String resumeUrl;

    public StudentProfile() {
    }

    public StudentProfile(Long id, User user, String studentId, String major, Integer graduationYear, String bio,
            String skills, String interests, String linkedinUrl, String resumeUrl) {
        this.id = id;
        this.user = user;
        this.studentId = studentId;
        this.major = major;
        this.graduationYear = graduationYear;
        this.bio = bio;
        this.skills = skills;
        this.interests = interests;
        this.linkedinUrl = linkedinUrl;
        this.resumeUrl = resumeUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    // Builder
    public static StudentProfileBuilder builder() {
        return new StudentProfileBuilder();
    }

    public static class StudentProfileBuilder {
        private Long id;
        private User user;
        private String studentId;
        private String major;
        private Integer graduationYear;
        private String bio;
        private String skills;
        private String interests;
        private String linkedinUrl;
        private String resumeUrl;

        public StudentProfileBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public StudentProfileBuilder user(User user) {
            this.user = user;
            return this;
        }

        public StudentProfileBuilder studentId(String studentId) {
            this.studentId = studentId;
            return this;
        }

        public StudentProfileBuilder major(String major) {
            this.major = major;
            return this;
        }

        public StudentProfileBuilder graduationYear(Integer graduationYear) {
            this.graduationYear = graduationYear;
            return this;
        }

        public StudentProfileBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public StudentProfileBuilder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public StudentProfileBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public StudentProfileBuilder linkedinUrl(String linkedinUrl) {
            this.linkedinUrl = linkedinUrl;
            return this;
        }

        public StudentProfileBuilder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public StudentProfile build() {
            return new StudentProfile(id, user, studentId, major, graduationYear, bio, skills, interests, linkedinUrl,
                    resumeUrl);
        }
    }
}
