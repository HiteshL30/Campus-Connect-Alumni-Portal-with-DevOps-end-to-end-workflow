package com.alumniconnect.dto;

import java.time.LocalDateTime;

/**
 * Hardened DTO for Verification requests using Java 17 Record.
 */
public record VerificationRequestDTO(
        Long id,
        String email,
        String firstName,
        String lastName,
        String role,
        String department,
        String rollNumber,
        boolean verified,
        LocalDateTime createdAt) {
    public static VerificationRequestDTOBuilder builder() {
        return new VerificationRequestDTOBuilder();
    }

    public static class VerificationRequestDTOBuilder {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private String department;
        private String rollNumber;
        private boolean verified;
        private LocalDateTime createdAt;

        public VerificationRequestDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public VerificationRequestDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public VerificationRequestDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public VerificationRequestDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public VerificationRequestDTOBuilder role(String role) {
            this.role = role;
            return this;
        }

        public VerificationRequestDTOBuilder department(String department) {
            this.department = department;
            return this;
        }

        public VerificationRequestDTOBuilder rollNumber(String rollNumber) {
            this.rollNumber = rollNumber;
            return this;
        }

        public VerificationRequestDTOBuilder verified(boolean verified) {
            this.verified = verified;
            return this;
        }

        public VerificationRequestDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public VerificationRequestDTO build() {
            return new VerificationRequestDTO(id, email, firstName, lastName, role, department, rollNumber, verified,
                    createdAt);
        }
    }
}
