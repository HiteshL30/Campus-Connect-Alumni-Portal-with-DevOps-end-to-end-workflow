package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private Long id;
    private String title;
    private String company;
    private String description;
    private String location;
    private String jobType;
    private String workplace;
    private String salary;
    private String requirements;
    private String applicationUrl;
    private Long postedById;
    private String postedByName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
    private String allowedBatch;
    private String allowedDepartment;
    private java.util.Set<String> requiredSkills;
}
