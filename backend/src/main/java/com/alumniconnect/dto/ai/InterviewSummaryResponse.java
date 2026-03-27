package com.alumniconnect.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSummaryResponse {
    private Long sessionId;
    private Integer totalScore;
    private String summary;
}
