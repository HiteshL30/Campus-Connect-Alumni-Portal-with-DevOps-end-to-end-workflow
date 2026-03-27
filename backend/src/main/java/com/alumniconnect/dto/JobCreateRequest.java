package com.alumniconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Company is required")
    private String company;

    private String description;
    private String location;
    private String jobType;
    private String workplace;
    private String salary;
    private String requirements;
    private String applicationUrl;
    private java.time.LocalDateTime expiryDate;
    private String allowedBatch;
    private String allowedDepartment;
    private java.util.Set<String> requiredSkills;
}
