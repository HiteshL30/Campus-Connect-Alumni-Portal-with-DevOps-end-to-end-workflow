package com.alumniconnect.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {
    private Long sessionId;
    private Integer round;
    private String difficulty;
    private String question;
    private boolean isComplete;
}
