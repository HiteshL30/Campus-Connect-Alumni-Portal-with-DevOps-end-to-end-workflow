package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDTO {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String department;
    private String studentId;
    private String major;
    private Integer graduationYear;
    private String bio;
    private String skills;
    private String interests;
    private String linkedinUrl;
    private String resumeUrl;
}
