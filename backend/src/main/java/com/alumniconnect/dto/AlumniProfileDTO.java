package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlumniProfileDTO {
    private Long profileId;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String department;
    private Integer graduationYear;
    private String currentCompany;
    private String currentPosition;
    private String industry;
    private String location;
    private String bio;
    private String skills;
    private String linkedinUrl;
    private Boolean availableForMentoring;
}
