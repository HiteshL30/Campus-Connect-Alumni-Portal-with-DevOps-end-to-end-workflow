package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedJobDTO {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String jobType;
    private Double matchScore;
    private java.util.Set<String> matchingSkills;
}
