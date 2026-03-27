package com.alumniconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "alumni_profiles")
public class AlumniProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer graduationYear;
    private String currentCompany;
    private String currentPosition;
    private String industry;
    private String location;
    private String bio;
    private String skills;
    private String linkedinUrl;
    private Boolean availableForMentoring;

    @Column(columnDefinition = "TEXT")
    private String resumeUrl;

    private Integer batch;

    public AlumniProfile() {
    }

    public AlumniProfile(Long id, User user, Integer graduationYear, String currentCompany, String currentPosition,
            String industry, String location, String bio, String skills, String linkedinUrl,
            Boolean availableForMentoring, String resumeUrl, Integer batch) {
        this.id = id;
        this.user = user;
        this.graduationYear = graduationYear;
        this.currentCompany = currentCompany;
        this.currentPosition = currentPosition;
        this.industry = industry;
        this.location = location;
        this.bio = bio;
        this.skills = skills;
        this.linkedinUrl = linkedinUrl;
        this.availableForMentoring = availableForMentoring;
        this.resumeUrl = resumeUrl;
        this.batch = batch;
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

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getCurrentCompany() {
        return currentCompany;
    }

    public void setCurrentCompany(String currentCompany) {
        this.currentCompany = currentCompany;
    }

    public String getCurrentPosition() {
        return currentPosition;
    }

    public void setCurrentPosition(String currentPosition) {
        this.currentPosition = currentPosition;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public Boolean getAvailableForMentoring() {
        return availableForMentoring;
    }

    public void setAvailableForMentoring(Boolean availableForMentoring) {
        this.availableForMentoring = availableForMentoring;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public Integer getBatch() {
        return batch;
    }

    public void setBatch(Integer batch) {
        this.batch = batch;
    }

    // Builder
    public static AlumniProfileBuilder builder() {
        return new AlumniProfileBuilder();
    }

    public static class AlumniProfileBuilder {
        private Long id;
        private User user;
        private Integer graduationYear;
        private String currentCompany;
        private String currentPosition;
        private String industry;
        private String location;
        private String bio;
        private String skills;
        private String linkedinUrl;
        private Boolean availableForMentoring;
        private String resumeUrl;
        private Integer batch;

        public AlumniProfileBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AlumniProfileBuilder user(User user) {
            this.user = user;
            return this;
        }

        public AlumniProfileBuilder graduationYear(Integer graduationYear) {
            this.graduationYear = graduationYear;
            return this;
        }

        public AlumniProfileBuilder currentCompany(String currentCompany) {
            this.currentCompany = currentCompany;
            return this;
        }

        public AlumniProfileBuilder currentPosition(String currentPosition) {
            this.currentPosition = currentPosition;
            return this;
        }

        public AlumniProfileBuilder industry(String industry) {
            this.industry = industry;
            return this;
        }

        public AlumniProfileBuilder location(String location) {
            this.location = location;
            return this;
        }

        public AlumniProfileBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public AlumniProfileBuilder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public AlumniProfileBuilder linkedinUrl(String linkedinUrl) {
            this.linkedinUrl = linkedinUrl;
            return this;
        }

        public AlumniProfileBuilder availableForMentoring(Boolean availableForMentoring) {
            this.availableForMentoring = availableForMentoring;
            return this;
        }

        public AlumniProfileBuilder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public AlumniProfileBuilder batch(Integer batch) {
            this.batch = batch;
            return this;
        }

        public AlumniProfile build() {
            return new AlumniProfile(id, user, graduationYear, currentCompany, currentPosition, industry, location, bio,
                    skills, linkedinUrl, availableForMentoring, resumeUrl, batch);
        }
    }
}
