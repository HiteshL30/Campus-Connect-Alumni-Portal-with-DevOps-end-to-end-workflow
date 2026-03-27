package com.alumniconnect.dto;

import com.alumniconnect.entity.Role;

public class UserProfileDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private Role role;
    private String department;
    private boolean verified;

    // Common Profile Fields
    private String bio;
    private String skills;
    private String linkedinUrl;
    private Integer graduationYear;

    // Alumni Specific
    private String currentCompany;
    private String currentPosition;
    private String industry;
    private String location;
    private Boolean availableForMentoring;

    // Student Specific
    private String interests;
    private String resumeUrl;
    private String studentId;
    private String major;

    public UserProfileDTO() {
    }

    // Builder-like constructor for convenience
    public UserProfileDTO(Long id, String email, String firstName, String lastName, String rollNumber,
            Role role, String department, boolean verified, String bio, String skills,
            String linkedinUrl, Integer graduationYear, String currentCompany,
            String currentPosition, String industry, String location,
            Boolean availableForMentoring, String interests, String resumeUrl,
            String studentId, String major) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rollNumber = rollNumber;
        this.role = role;
        this.department = department;
        this.verified = verified;
        this.bio = bio;
        this.skills = skills;
        this.linkedinUrl = linkedinUrl;
        this.graduationYear = graduationYear;
        this.currentCompany = currentCompany;
        this.currentPosition = currentPosition;
        this.industry = industry;
        this.location = location;
        this.availableForMentoring = availableForMentoring;
        this.interests = interests;
        this.resumeUrl = resumeUrl;
        this.studentId = studentId;
        this.major = major;
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

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
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

    public Boolean getAvailableForMentoring() {
        return availableForMentoring;
    }

    public void setAvailableForMentoring(Boolean availableForMentoring) {
        this.availableForMentoring = availableForMentoring;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
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

    // Manual Builder inner class
    public static UserProfileDTOBuilder builder() {
        return new UserProfileDTOBuilder();
    }

    public static class UserProfileDTOBuilder {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String rollNumber;
        private Role role;
        private String department;
        private boolean verified;
        private String bio;
        private String skills;
        private String linkedinUrl;
        private Integer graduationYear;
        private String currentCompany;
        private String currentPosition;
        private String industry;
        private String location;
        private Boolean availableForMentoring;
        private String interests;
        private String resumeUrl;
        private String studentId;
        private String major;

        public UserProfileDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserProfileDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserProfileDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserProfileDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserProfileDTOBuilder rollNumber(String rollNumber) {
            this.rollNumber = rollNumber;
            return this;
        }

        public UserProfileDTOBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserProfileDTOBuilder department(String department) {
            this.department = department;
            return this;
        }

        public UserProfileDTOBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public UserProfileDTOBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public UserProfileDTOBuilder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public UserProfileDTOBuilder linkedinUrl(String linkedinUrl) {
            this.linkedinUrl = linkedinUrl;
            return this;
        }

        public UserProfileDTOBuilder graduationYear(Integer graduationYear) {
            this.graduationYear = graduationYear;
            return this;
        }

        public UserProfileDTOBuilder currentCompany(String currentCompany) {
            this.currentCompany = currentCompany;
            return this;
        }

        public UserProfileDTOBuilder currentPosition(String currentPosition) {
            this.currentPosition = currentPosition;
            return this;
        }

        public UserProfileDTOBuilder industry(String industry) {
            this.industry = industry;
            return this;
        }

        public UserProfileDTOBuilder location(String location) {
            this.location = location;
            return this;
        }

        public UserProfileDTOBuilder availableForMentoring(Boolean availableForMentoring) {
            this.availableForMentoring = availableForMentoring;
            return this;
        }

        public UserProfileDTOBuilder interests(String interests) {
            this.interests = interests;
            return this;
        }

        public UserProfileDTOBuilder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public UserProfileDTOBuilder studentId(String studentId) {
            this.studentId = studentId;
            return this;
        }

        public UserProfileDTOBuilder major(String major) {
            this.major = major;
            return this;
        }

        public UserProfileDTO build() {
            return new UserProfileDTO(id, email, firstName, lastName, rollNumber, role, department, verified,
                    bio, skills, linkedinUrl, graduationYear, currentCompany, currentPosition,
                    industry, location, availableForMentoring, interests, resumeUrl, studentId, major);
        }
    }
}
