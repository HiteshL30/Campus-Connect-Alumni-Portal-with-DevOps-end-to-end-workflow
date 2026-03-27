package com.alumniconnect.dto;

import com.alumniconnect.entity.Role;

public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String rollNumber;
    private Role role;
    private String department;
    private boolean verified;

    public UserDTO() {
    }

    public UserDTO(Long id, String email, String firstName, String lastName, String rollNumber, Role role,
            String department, boolean verified) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.rollNumber = rollNumber;
        this.role = role;
        this.department = department;
        this.verified = verified;
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

    public static UserDTOBuilder builder() {
        return new UserDTOBuilder();
    }

    public static class UserDTOBuilder {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String rollNumber;
        private Role role;
        private String department;
        private boolean verified;

        public UserDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserDTOBuilder rollNumber(String rollNumber) {
            this.rollNumber = rollNumber;
            return this;
        }

        public UserDTOBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserDTOBuilder department(String department) {
            this.department = department;
            return this;
        }

        public UserDTOBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public UserDTO build() {
            return new UserDTO(id, email, firstName, lastName, rollNumber, role, department, verified);
        }
    }
}
