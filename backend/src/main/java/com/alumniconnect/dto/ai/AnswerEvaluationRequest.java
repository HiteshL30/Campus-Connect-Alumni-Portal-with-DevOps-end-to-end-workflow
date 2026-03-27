package com.alumniconnect.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerEvaluationRequest {
    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotBlank(message = "Answer is required")
    private String answer;
}
